// Vercel serverless function — lista los contratos pendientes de evaluación
// Uso: GET /api/check-pending?key=DUSAKAWI2026

const PB_URL     = 'https://evaluacion-db.duckdns.org';
const PB_EMAIL   = 'jd_vanegas@hotmail.com';
const PB_PASS    = 'Vanegas1920';
const RAD_BASE   = 'https://radicacion.vercel.app';
const RAD_TOKEN  = 'DUSAKAWI-RIPS-2026';
const SECRET     = 'DUSAKAWI2026';

const TRIMS = [
  { id: '1T', anio: 2026, meses: [3],        mesesES: ['Marzo 2026'] },
  { id: '2T', anio: 2026, meses: [4,5,6],    mesesES: ['Abril 2026','Mayo 2026','Junio 2026'] },
  { id: '3T', anio: 2026, meses: [7,8,9],    mesesES: ['Julio 2026','Agosto 2026','Septiembre 2026'] },
  { id: '4T', anio: 2026, meses: [10,11,12], mesesES: ['Octubre 2026','Noviembre 2026','Diciembre 2026'] },
  { id: 'OS', anio: 2027, meses: [1,2],       mesesES: ['Enero 2027','Febrero 2027'] },
];

// ── Mismas reglas que App.tsx (radEstadoMes / radActaDeTrim / radContratoRegistrado) ──
const MESES_PERIODO = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const mesClave = (anio, mes) => `${anio}-${String(mes).padStart(2, '0')}`;
function mesesDePeriodo(texto) {
  const t = String(texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const out = new Set();
  const anios = t.match(/\b20\d{2}\b/g) || [];
  const anioDef = anios.length ? anios[anios.length - 1] : '2026';
  let sinAnio = [];
  (t.match(/[a-z]+|\d{4}/g) || []).forEach(tok => {
    const mi = tok === 'setiembre' ? 8 : MESES_PERIODO.indexOf(tok);
    if (mi >= 0) sinAnio.push(mi + 1);
    else if (/^20\d{2}$/.test(tok)) { sinAnio.forEach(m => out.add(`${tok}-${String(m).padStart(2, '0')}`)); sinAnio = []; }
  });
  sinAnio.forEach(m => out.add(`${anioDef}-${String(m).padStart(2, '0')}`));
  if (out.size === 0) {
    (t.match(/\b[1-4]\s*t\b/g) || []).forEach(code => {
      const tr = TRIMS.find(x => x.id === `${code[0]}T`);
      if (tr) tr.meses.forEach(m => out.add(mesClave(tr.anio, m)));
    });
    if (/\bo\s*\/?\s*s\b/.test(t)) TRIMS[4].meses.forEach(m => out.add(mesClave(TRIMS[4].anio, m)));
  }
  return [...out].sort();
}
const normContrato = x => String(x || '').toUpperCase().replace(/[\u2010-\u2015\u2212]/g, '-').replace(/\s+/g, '');
const normNit = x => String(x || '').replace(/\D/g, '').slice(0, 9);
const simContrato = (x, y) => {
  const gx = normContrato(x).match(/\d+/g) || [], gy = normContrato(y).match(/\d+/g) || [];
  let n = 0;
  for (let i = 0; i < Math.min(gx.length, gy.length); i++) if (Number(gx[i]) === Number(gy[i])) n++;
  return n;
};

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  if (url.searchParams.get('key') !== SECRET) {
    return res.status(401).json({ error: 'Acceso denegado' });
  }

  // 1. Auth PocketBase
  const authR = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: PB_EMAIL, password: PB_PASS }),
  });
  const { token } = await authR.json();
  if (!token) return res.status(500).json({ error: 'PB auth failed' });

  // 2. Obtener actas y prestadores de PocketBase
  const storR = await fetch(
    `${PB_URL}/api/collections/app_storage/records?filter=(key='actas'||key='prestadores')&perPage=10`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const storData = await storR.json();
  const byKey = {};
  for (const r of (storData.items || [])) byKey[r.key] = r;
  const actas       = byKey['actas']?.value || [];
  const prestadores = byKey['prestadores']?.value || [];

  // 3. Obtener datos de radicación
  const radR = await fetch(`${RAD_BASE}/api/evaluar`, {
    headers: { 'x-token': RAD_TOKEN },
  });
  const radData = await radR.json();
  const registros = radData.registros || [];
  const contratos = radData.contratos || [];

  // 4. Calcular pendientes (misma lógica que el app)
  // La API guarda por mes de FACTURACIÓN: la atención del mes M llega en la factura de M+1,
  // y un mes cuenta solo si su factura trae usuarios, servicios o meses RIPS.
  const tieneReg = (contrato, anio, mesAtencion, reg) => {
    const bMes  = mesAtencion === 12 ? 1 : mesAtencion + 1;
    const bAnio = mesAtencion === 12 ? anio + 1 : anio;
    return registros.some(r =>
      r.contrato === contrato && r.periodo_anio === bAnio && r.periodo_mes === bMes && r.regimen === reg &&
      ((r.n_usuarios > 0) || (r.n_servicios > 0) || (r.meses_rips > 0)));
  };
  // Un acta cuenta para un contrato por su número de contrato; por NIT solo si el acta no tiene
  // contrato y el NIT tiene un único contrato en radicación.
  const actaEsDeContrato = (a, contrato, nit) => {
    const aNit = normNit(a.nit) || normNit((prestadores.find(p => p.id === a.prestadorId) || {}).nit);
    if (normContrato(a.contrato)) {
      return normContrato(a.contrato) === normContrato(contrato) ||
        (!!aNit && aNit === normNit(nit) && simContrato(a.contrato, contrato) >= 3);
    }
    if (!aNit || aNit !== normNit(nit)) return false;
    return contratos.filter(rc => normNit(rc.nit) === aNit).length <= 1;
  };
  const trimActa = (contrato, nit, regLabel, t) => {
    const mesesT = t.meses.map(m => mesClave(t.anio, m));
    return actas.some(a =>
      (a.regimen || 'SUBSIDIADO').toUpperCase() === regLabel &&
      actaEsDeContrato(a, contrato, nit) &&
      mesesDePeriodo(a.periodoEvaluado).some(m => mesesT.includes(m)));
  };
  const prestadorDe = c =>
    prestadores.find(p => normContrato(p.contrato) === normContrato(c.contrato)) ||
    prestadores.find(p => normNit(p.nit) === normNit(c.nit) && simContrato(p.contrato, c.contrato) >= 3);

  // Solo contratos registrados en la app
  const pendientes = [];
  for (const c of contratos) {
    const prest = prestadorDe(c);
    if (!prest) continue;  // no registrado en la app

    for (const reg of ['RS', 'RC']) {
      const regLabel = reg === 'RC' ? 'CONTRIBUTIVO' : 'SUBSIDIADO';
      for (const t of TRIMS) {
        const completo = t.meses.every(m => tieneReg(c.contrato, t.anio, m, reg));
        if (!completo) continue;

        const tieneActa = trimActa(c.contrato, c.nit, regLabel, t);
        if (!tieneActa) {
          pendientes.push({
            contrato: c.contrato,
            nombre: prest.nombre || c.nombre || '',
            nit: c.nit || prest.nit || '',
            municipio: prest.municipio || '',
            regimen: regLabel,
            trimestre: t.id,
            periodoLabel: t.mesesES.join(' / '),
          });
        }
      }
    }
  }

  // HTML bonito para ver en el navegador
  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Pendientes de evaluación</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 900px; margin: 2rem auto; padding: 0 1rem; }
  h1 { color: #1e3a5f; }
  .badge { display:inline-block; padding:2px 8px; border-radius:999px; font-size:12px; font-weight:600; }
  .sub  { background:#ede9fe; color:#5b21b6; }
  .cont { background:#fff3cd; color:#92400e; }
  .t1 { background:#dcfce7; color:#166534; }
  .t2 { background:#dbeafe; color:#1e40af; }
  .t3 { background:#fee2e2; color:#991b1b; }
  .t4 { background:#f3f4f6; color:#374151; }
  table { width:100%; border-collapse:collapse; margin-top:1rem; }
  th { background:#1e3a5f; color:white; padding:8px 12px; text-align:left; font-size:13px; }
  td { padding:8px 12px; border-bottom:1px solid #e5e7eb; font-size:13px; }
  tr:hover td { background:#f9fafb; }
  .cnt { font-size:1.5rem; font-weight:bold; color:#dc2626; }
</style></head>
<body>
<h1>Listos para evaluar — Pendientes</h1>
<p>Total: <span class="cnt">${pendientes.length}</span> pendientes &nbsp;|&nbsp; Actas en BD: ${actas.length} &nbsp;|&nbsp; Prestadores: ${prestadores.length}</p>
<table>
<tr><th>#</th><th>Contrato</th><th>Prestador</th><th>Municipio</th><th>Régimen</th><th>Trimestre</th><th>Período</th></tr>
${pendientes.map((p, i) => `
<tr>
  <td>${i+1}</td>
  <td><code>${p.contrato}</code></td>
  <td>${p.nombre}</td>
  <td>${p.municipio}</td>
  <td><span class="badge ${p.regimen === 'SUBSIDIADO' ? 'sub' : 'cont'}">${p.regimen}</span></td>
  <td><span class="badge ${p.trimestre === '1T' ? 't1' : p.trimestre === '2T' ? 't2' : p.trimestre === '3T' ? 't3' : 't4'}">${p.trimestre}</span></td>
  <td>${p.periodoLabel}</td>
</tr>`).join('')}
</table>
<p style="margin-top:2rem;color:#6b7280;font-size:12px">Generado ${new Date().toLocaleString('es-CO')}</p>
</body></html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
}
