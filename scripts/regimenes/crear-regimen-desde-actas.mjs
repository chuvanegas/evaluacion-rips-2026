#!/usr/bin/env node
// Crea el registro de régimen que le falta a un contrato a partir de las metas de SUS propias actas.
// Mismas reglas que "Validar regímenes" de la app (v2.33): las funciones se toman de App.tsx.
//
// Uso (desde la raíz del repo, con `npm install` hecho; en la nube anteponer NODE_USE_ENV_PROXY=1):
//   node scripts/regimenes/crear-regimen-desde-actas.mjs --plan
//   node scripts/regimenes/crear-regimen-desde-actas.mjs --aplicar --regimen=SUBSIDIADO --claves-archivo=diagnostico/crear-regimen-plan.json
//
// Se crea el registro solo si:
//   - el contrato tiene registro del otro régimen y no tiene el pedido;
//   - hay actas reales del régimen pedido y la más reciente que divide exacto (programado ÷ meses) da las metas;
//   - Subsidiado > Contributivo: para crear SUBSIDIADO ningún servicio puede quedar menor que en el
//     Contributivo y al menos uno debe ser mayor (al revés para crear CONTRIBUTIVO);
//   - el contrato tiene número y el NIT está bien escrito; no es PAI.
// --aplicar vuelve a leer los datos, crea un respaldo `prestadores_respaldo_<fecha>` en app_storage y
// solo entonces agrega los registros. Los archivos de salida no llevan credenciales ni valores de metas.
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import os from 'node:os';

const raiz = process.cwd();
const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, ...v] = a.replace(/^--/, '').split('=');
  return [k, v.length ? v.join('=') : true];
}));
const aplicar = !!args.aplicar;
const regimenPedido = String(args.regimen || 'SUBSIDIADO').toUpperCase() === 'CONTRIBUTIVO' ? 'CONTRIBUTIVO' : 'SUBSIDIADO';
const salida = String(args.salida || 'diagnostico/crear-regimen');
const ahora = new Date();

// ── 1) Funciones de la app ────────────────────────────────────────────────
const app = readFileSync(path.join(raiz, 'App.tsx'), 'utf8');
const ini = app.indexOf('const MESES_NOMBRES_ES'), fin = app.indexOf('const DEFAULT_USERS');
if (ini < 0 || fin < 0) throw new Error('No se encontraron las funciones de módulo en App.tsx');
const tmp = mkdtempSync(path.join(os.tmpdir(), 'regimenes-'));
writeFileSync(path.join(tmp, 'mod.ts'),
  `import { TIPOS_ASISTENCIAL, TIPOS_ESPECIALIDADES, TIPOS_CAPITA_AMPLIADA, TIPOS_PAI, esActaHistorica } from ${JSON.stringify(path.join(raiz, 'utils/logic'))};\n` +
  `type Acta = any; type Prestador = any; type ServiceTypeMeta = any;\n` +
  app.slice(ini, fin).split("import('./types').Acta").join('any') +
  `\nexport { revisarRegimenes, metasDesdeActas, firmaContrato, regimenDe, limpiarContratoTexto, normNit, mesesDePeriodo, esActaHistorica };\n`);
execFileSync(path.join(raiz, 'node_modules/.bin/esbuild'),
  [path.join(tmp, 'mod.ts'), '--bundle', '--platform=node', '--format=cjs', `--outfile=${path.join(tmp, 'mod.cjs')}`, '--log-level=warning']);
const L = createRequire(import.meta.url)(path.join(tmp, 'mod.cjs'));

// ── 2) PocketBase (credenciales leídas del cliente de la app, solo en memoria) ──
const cliente = readFileSync(path.join(raiz, 'services/supabaseClient.ts'), 'utf8');
const constante = n => (cliente.match(new RegExp(`const ${n}\\s*=\\s*'([^']+)'`)) || [])[1];
const PB_URL = process.env.PB_URL_PRUEBA || constante('PB_URL');
const PB_EMAIL = constante('PB_EMAIL'), PB_PASS = constante('PB_PASS');
let token = '';
async function pb(method, ruta, body) {
  const r = await fetch(PB_URL + ruta, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`PocketBase ${method} ${ruta.split('?')[0]} → ${r.status}`);
  return r.json();
}
const leer = async key =>
  (await pb('GET', `/api/collections/app_storage/records?filter=${encodeURIComponent(`(key='${key}')`)}&perPage=1`)).items?.[0];

// ── 3) Plan ────────────────────────────────────────────────────────────────
const nitValido = nit => /^\d{9,10}(-\d)?$/.test(String(nit || '').replace(/[\s.]/g, ''));
const mapaMetas = metas => Object.fromEntries((metas || []).filter(m => m.active && m.monthlyGoal > 0).map(m => [m.type, m.monthlyGoal]));
const ultimoMes = a => [...L.mesesDePeriodo(a.periodoEvaluado)].sort().slice(-1)[0] || '';

function evaluar(f, rv) {
  const base = f.base;
  const otro = base.metas || [];
  const mapaOtro = mapaMetas(otro);
  const reales = f.actas.filter(a => !L.esActaHistorica(a) && (a.servicios || []).some(s => s.programado > 0))
    .sort((x, y) => ultimoMes(y).localeCompare(ultimoMes(x)) || String(y.createdAt || '').localeCompare(String(x.createdAt || '')));
  const item = {
    clave: f.clave, regimen: f.regimen, nombre: f.nombre, nit: f.nit, contrato: f.contrato,
    tipoContrato: base.tipoContrato || 'ASISTENCIAL', registroOtroRegimen: base.id, actasReales: reales.length,
    acta: null, periodo: null, serviciosComparados: 0, mayores: 0, iguales: 0, menores: [], actasDifieren: false,
    otroRegimenRepetido: rv.duplicados.some(d => d.registros.some(p => p.id === base.id)),
    decision: '', _nuevo: null,
  };
  if (!L.firmaContrato(f.contrato)) return { ...item, decision: 'sin_numero_de_contrato' };
  if (!nitValido(f.nit)) return { ...item, decision: 'nit_mal_digitado' };
  if ((base.tipoContrato || '') === 'PAI') return { ...item, decision: 'pai_digitar_metas' };
  if (!reales.length) return { ...item, decision: 'sin_actas_del_regimen' };
  // Acta más reciente cuyo programado se divide exacto entre los meses del período
  let elegida = null, prop = null;
  const porActa = [];
  for (const a of reales) {
    const pr = L.metasDesdeActas([a], base.tipoContrato, otro);
    const exacta = !!pr.fuente && !(pr.aviso && /no dan exacto/.test(pr.aviso));
    if (exacta) porActa.push(mapaMetas(pr.metas));
    if (exacta && !elegida) { elegida = a; prop = pr; }
  }
  if (!elegida) return { ...item, decision: 'division_inexacta_revisar' };
  const nuevo = mapaMetas(prop.metas);
  const tipos = [...new Set([...Object.keys(nuevo), ...Object.keys(mapaOtro)])];
  // El Subsidiado debe ser mayor que el Contributivo
  const debeSerMayor = f.regimen === 'SUBSIDIADO';
  const malos = tipos.filter(t => debeSerMayor ? (nuevo[t] || 0) < (mapaOtro[t] || 0) : (nuevo[t] || 0) > (mapaOtro[t] || 0));
  const iguales = tipos.filter(t => (nuevo[t] || 0) === (mapaOtro[t] || 0));
  const buenos = tipos.filter(t => debeSerMayor ? (nuevo[t] || 0) > (mapaOtro[t] || 0) : (nuevo[t] || 0) < (mapaOtro[t] || 0));
  const firma = m => Object.entries(m).sort().join(';');
  const decision = malos.length ? (debeSerMayor ? 'menor_que_contributivo_en_algun_servicio' : 'mayor_que_subsidiado_en_algun_servicio')
    : buenos.length === 0 ? 'iguales_al_otro_regimen' : 'crear';
  return {
    ...item, acta: elegida.numero, periodo: elegida.periodoEvaluado, serviciosComparados: tipos.length,
    mayores: debeSerMayor ? buenos.length : malos.length, iguales: iguales.length, menores: debeSerMayor ? malos : buenos,
    actasDifieren: porActa.some(m => firma(m) !== firma(porActa[0])),
    decision,
    _nuevo: decision !== 'crear' ? null : {
      nombre: base.nombre, nit: base.nit, departamento: base.departamento || '', municipio: base.municipio || '',
      contrato: L.limpiarContratoTexto(base.contrato), vigencia: base.vigencia || '', regimen: f.regimen,
      repLegalIPS: base.repLegalIPS || '', tipoContrato: prop.tipoContrato, metas: prop.metas,
      metasRecuperadasDe: `${elegida.numero} (${elegida.periodoEvaluado})`,
      creadoDesdeActas: ahora.toISOString(),
    },
  };
}
function plan(prestadores, actas, regimen) {
  const rv = L.revisarRegimenes(prestadores, actas);
  return rv.faltantes.filter(f => f.base && f.regimen === regimen).map(f => evaluar(f, rv));
}
const publico = x => { const { _nuevo, ...resto } = x; return resto; };
const resumen = lista => lista.reduce((o, x) => ({ ...o, [x.decision]: (o[x.decision] || 0) + 1 }), {});

// ── 4) Ejecución ──────────────────────────────────────────────────────────
token = (await pb('POST', '/api/admins/auth-with-password', { identity: PB_EMAIL, password: PB_PASS })).token;
let recP = await leer('prestadores');
const recA = await leer('actas');
if (!recP || !Array.isArray(recP.value) || !recA || !Array.isArray(recA.value)) throw new Error('No se pudieron leer prestadores/actas');
const informe = {
  fecha: ahora.toISOString(), modo: aplicar ? 'aplicar' : 'plan',
  antes: { prestadores: recP.value.length, actualizado: recP.updated, actas: recA.value.length },
};
const planS = plan(recP.value, recA.value, 'SUBSIDIADO');
const planC = plan(recP.value, recA.value, 'CONTRIBUTIVO');
informe.subsidiado = { resumen: resumen(planS), items: planS.map(publico) };
informe.contributivo = { resumen: resumen(planC), items: planC.map(publico) };
informe.crear = (regimenPedido === 'SUBSIDIADO' ? planS : planC).filter(x => x.decision === 'crear').map(x => x.clave);

if (aplicar) {
  const aprobadas = new Set(args['claves-archivo']
    ? JSON.parse(readFileSync(String(args['claves-archivo']), 'utf8')).crear
    : String(args.claves || '').split(',').filter(Boolean));
  let creados = [];
  for (let intento = 1; intento <= 3; intento++) {
    recP = await leer('prestadores');
    const fresco = plan(recP.value, recA.value, regimenPedido).filter(x => x.decision === 'crear' && aprobadas.has(x.clave));
    if (!fresco.length) break;
    const t0 = Date.now();
    const nuevos = fresco.map((x, i) => ({ id: String(t0 + i), ...x._nuevo }));
    const clavesNuevos = fresco.map(x => x.clave);
    const respaldo = `prestadores_respaldo_${ahora.toISOString().slice(0, 19).replace(/[:T]/g, '-')}`;
    if (!informe.respaldo) {
      await pb('POST', '/api/collections/app_storage/records', { key: respaldo, value: recP.value });
      const r = await leer(respaldo);
      if (!r || r.value.length !== recP.value.length) throw new Error('El respaldo no quedó guardado; no se modificó nada');
      informe.respaldo = { key: respaldo, prestadores: r.value.length };
    }
    // Si alguien guardó prestadores mientras tanto, se vuelve a calcular sobre lo nuevo
    const control = await leer('prestadores');
    if (control.updated !== recP.updated) { informe[`reintento${intento}`] = 'prestadores cambió durante la escritura'; continue; }
    await pb('PATCH', `/api/collections/app_storage/records/${recP.id}`, { value: [...recP.value, ...nuevos] });
    creados = nuevos.map((n, i) => ({ ...n, _clave: clavesNuevos[i] }));
    break;
  }
  const despues = await leer('prestadores');
  const ids = new Set(despues.value.map(p => p.id));
  informe.creados = creados.map(n => ({ id: n.id, nombre: n.nombre, nit: n.nit, contrato: n.contrato, regimen: n.regimen, metasDe: n.metasRecuperadasDe, verificado: ids.has(n.id) }));
  informe.despues = { prestadores: despues.value.length, actualizado: despues.updated };
  // Aprobados en el plan que ya no cumplían al aplicar (p. ej. el registro se creó a mano entre tanto)
  informe.aprobadosNoCreados = [...aprobadas].filter(k => !creados.some(n => n._clave === k));
}

mkdirSync(path.dirname(path.resolve(raiz, salida)), { recursive: true });
writeFileSync(path.resolve(raiz, `${salida}-${informe.modo}.json`), JSON.stringify(informe, null, 2));
const linea = x => `| ${x.nombre} | ${x.nit} | ${x.contrato} | ${x.acta || '—'} | ${x.periodo || '—'} | ${x.serviciosComparados} | ${x.mayores} | ${x.iguales} | ${x.menores.join(', ') || '—'} | ${x.actasDifieren ? 'sí' : ''} | **${x.decision}** |`;
const tabla = lista => ['| IPS | NIT | Contrato | Acta usada | Período | Servicios | Mayores | Iguales | Menores | Actas difieren | Decisión |',
  '|---|---|---|---|---|---|---|---|---|---|---|', ...lista.filter(x => x.actasReales > 0 || x.decision !== 'sin_actas_del_regimen').map(linea)].join('\n');
writeFileSync(path.resolve(raiz, `${salida}-${informe.modo}.md`), [
  `# Crear régimen faltante desde actas — ${informe.modo} (${informe.fecha})`, '',
  `Prestadores antes: ${informe.antes.prestadores} · actas: ${informe.antes.actas}.`,
  informe.respaldo ? `Respaldo en app_storage: \`${informe.respaldo.key}\` (${informe.respaldo.prestadores} registros).` : '',
  informe.creados ? `Creados: ${informe.creados.length} · verificados: ${informe.creados.filter(c => c.verificado).length} · prestadores después: ${informe.despues.prestadores}.` : '',
  '', `## Falta SUBSIDIADO (${JSON.stringify(informe.subsidiado.resumen)})`, '', tabla(planS), '',
  `## Falta CONTRIBUTIVO (${JSON.stringify(informe.contributivo.resumen)})`, '', tabla(planC), '',
].join('\n'));
console.log(JSON.stringify({ modo: informe.modo, subsidiado: informe.subsidiado.resumen, contributivo: informe.contributivo.resumen, crear: informe.crear.length, creados: informe.creados?.length, respaldo: informe.respaldo?.key }, null, 1));
