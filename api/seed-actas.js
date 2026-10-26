// Vercel serverless function — crea/corrige actas placeholder para contratos ya evaluados
// Uso: GET /api/seed-actas?key=DUSAKAWI2026
// Solo ejecutar una vez; después borrar o desactivar.

const PB_URL   = 'https://evaluacion-db.duckdns.org';
const PB_EMAIL = 'jd_vanegas@hotmail.com';
const PB_PASS  = 'Vanegas1920';
const SECRET   = 'DUSAKAWI2026';

// Mapeo de código trimestre → periodoEvaluado en formato que el app reconoce
// El check en App.tsx usa: t.mesesES.some(mes => periodoEvaluado.toLowerCase().includes(mes.toLowerCase()))
// mesesES: 1T=['Marzo 2026'], 2T=['Abril 2026','Mayo 2026','Junio 2026'], 3T=['Julio...']
const PERIODO_MAP = {
  '1T 2026': 'Marzo 2026',
  '2T 2026': 'Abril, Mayo y Junio 2026',
  '3T 2026': 'Julio, Agosto y Septiembre 2026',
  '4T 2026': 'Octubre, Noviembre y Diciembre 2026',
};

// Meses esperados por el app para detectar cada trimestre (any match)
const MESES_CHECK = {
  '1T 2026': ['marzo 2026'],
  '2T 2026': ['abril 2026', 'mayo 2026', 'junio 2026'],
  '3T 2026': ['julio 2026', 'agosto 2026', 'septiembre 2026'],
  '4T 2026': ['octubre 2026', 'noviembre 2026', 'diciembre 2026'],
};

// Contratos EVALUADOS del Google Sheets (período y régimen)
const EVALUADOS = [
  ["ASB-44847-2026-30","892115347","ESE HOSPITAL DE NAZARETH","URIBIA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["ASE-47001-2026-37","819004070","ESE ALEJANDRO PROSPERO REVEREND","SANTA MARTA",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASB-20001-2026-36","824002362","DUSAKAWI IPS","VALLEDUPAR",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASE-44090-2026-42","901217389","MAKUSHAMA SALUD IPS SAS","DIBULLA",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASE-20570-2026-67","900073645","WINTUKWA IPSI","PUEBLO BELLO",["2T 2026"],["SUBSIDIADO"]],
  ["ASE-44650-2026-62","824002362","DUSAKAWI IPS","SAN JUAN DEL CESAR",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASB-20045-2026-26","824002362","DUSAKAWI IPS","BECERRIL",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASE-20001-2026-50","900060562","KANKUAMA IPSI","VALLEDUPAR",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["ASE-44847-2026-54","900185729","IPSI PALAIMA","URIBIA",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASE-44847-2026-47","900517548","IPSI CENTRO EPIDEMIOLOGICO JEKEET AKUAITA","URIBIA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["ASE-44001-2026-44","901217389","MAKUSHAMA SALUD IPS SAS","RIOHACHA",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASE-44430-2026-52","900144397","IPSI WAYUU ANASHII","MAICAO",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASE-20001-2026-61","900060562","KANKUAMA IPSI","VALLEDUPAR",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASE-44430-2026-63","825003149","IPSI SUPULA WAYUU","MAICAO",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASE-44847-2026-56","900191322","IPSI OUTTAJIAPULEE","URIBIA",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASE-44560-2026-53","900016853","UNIDAD MEDICA WAYUU ANOUTA WAKUAIPA IPSI","MANAURE",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASB-44090-2026-10","825001037","ESE HOSPITAL SANTA TERESA DE JESUS DE AVILA","DIBULLA",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASE-44001-2026-38","900517548","IPSI CENTRO EPIDEMIOLOGICO JEKEET AKUAITA","RIOHACHA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["ASE-47660-2026-46","901534837","MUNDO MEDIC IPS SAS","SABANAS DE SAN ANGEL",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASB-44279-2026-31","892170002","ESE HOSPITAL SAN AGUSTIN DE FONSECA","FONSECA",["1T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASB-47189-2026-24","819003539","GONAWINDA ETTE ENNAKA IPS INDIGENA","CIENAGA",["1T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASB-47053-2026-22","819003539","GONAWINDA ETTE ENNAKA IPS INDIGENA","ARACATACA",["1T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASB-47288-2026-19","819003539","GONAWINDA ETTE ENNAKA IPS INDIGENA","FUNDACION",["1T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASB-47001-2026-27","819003539","GONAWINDA ETTE ENNAKA IPS INDIGENA","SANTA MARTA",["1T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASB-44090-2026-34","819003539","GONAWINDA ETTE ENNAKA IPS INDIGENA","DIBULLA",["1T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASB-20013-2026-02","892300358","HOSPITAL AGUSTIN CODAZZI","AGUSTIN CODAZZI",["2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASB-20570-2026-03","824002672","HOSPITAL CAMILO VILLAZON PUMAREJO","PUEBLO BELLO",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["MDC-20001-2026-07","900073645","WINTUKWA IPSI","VALLEDUPAR",["2T 2026"],["SUBSIDIADO"]],
  ["MDC-20001-2026-06","900060562","KANKUAMA IPSI","VALLEDUPAR",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["MDC-44847-2026-12","901556821","SUMINFARMA SAS","URIBIA",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASB-20001-2026-04","824000725","E S E HOSPITAL EDUARDO ARREDONDO DAZA","VALLEDUPAR",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["MDC-44001-2026-15","901556821","SUMINFARMA SAS","RIOHACHA",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["DNT-44001-2026-01","901182049","GRUPO IMB IPS SAS","RIOHACHA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["DNT-47001-2026-06","900222619","IPS FUNDACION SUMA","SANTA MARTA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["DNT-44090-2026-07","900222619","IPS FUNDACION SUMA","DIBULLA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["EB-44378-2026-01","900559160","IPS SALUD INTEGRAL H&B S.A.S.","HATO NUEVO",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["EB-20001-2026-06","824002362","DUSAKAWI IPS","VALLEDUPAR",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["MD-RCV-20001-2026-58","824002362","DUSAKAWI IPS","VALLEDUPAR",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["PAI-44560-2026-47","825000147","E.S.E. HOSPITAL ARMANDO PABON LOPEZ","MANAURE",["1T 2026"],["SUBSIDIADO"]],
  ["ASE-44001-2026-39","900589110","WALE KERU IPSI","RIOHACHA",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASE-44430-2026-57","900210003","IPSI AYUULEEPALA WAYUU","MAICAO",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASB-20621-2026-17","824002362","DUSAKAWI IPS","LA PAZ",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASE-20001-2026-65","900073645","WINTUKWA IPSI","VALLEDUPAR",["2T 2026"],["SUBSIDIADO"]],
  ["ASE-44847-2026-66","825003149","IPSI SUPULA WAYUU","URIBIA",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASE-44001-2026-48","900016853","UNIDAD MEDICA WAYUU ANOUTA WAKUAIPA IPSI","RIOHACHA",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASE-44001-2026-58","825003149","IPSI SUPULA WAYUU","RIOHACHA",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["ASB-44035-2026-25","825002525","ESE HOSPITAL SAN RAFAEL DE ALBANIA","ALBANIA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["ASE-44001-2026-41","900209093","I.P.S.I ANASHANTA SUPUSHUAYA","RIOHACHA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["ASE-44430-2026-43","900141404","IPSI KARAQUITA","MAICAO",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["ASE-44001-2026-45","900794134","IPSI INDIGENA KOTTUSHI SAO ANA","RIOHACHA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["ASB-20013-2026-33","824002362","DUSAKAWI IPS","AGUSTIN CODAZZI",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["PMS-44001-2026-30","900589110","WALE KERU IPSI","RIOHACHA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["PMS-47001-2026-54","819004070","ESE ALEJANDRO PROSPERO REVEREND","SANTA MARTA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["PMS-44430-2026-13","900210003","IPSI AYUULEEPALA WAYUU","MAICAO",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["PMS-44847-2026-35","900185729","IPSI PALAIMA","URIBIA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["PMS-44430-2026-18","900144397","IPSI WAYUU ANASHII","MAICAO",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["PMS-44847-2026-53","900517548","IPSI CENTRO EPIDEMIOLOGICO JEKEET AKUAITA","URIBIA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["PMS-44847-2026-36","825003149","IPSI SUPULA WAYUU","URIBIA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["PMS-44430-2026-15","839000936","IPSI EREJEERIA WAYUU","MAICAO",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["PMS-44430-2026-17","825003149","IPSI SUPULA WAYUU","MAICAO",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["PMS-44560-2026-22","900016853","UNIDAD MEDICA WAYUU ANOUTA WAKUAIPA IPSI","MANAURE",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["PMS-44430-2026-19","900486723","IPSI WAYUU TALATSSHI","MAICAO",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["PMS-44847-2026-34","900191322","IPSI OUTTAJIAPULEE","URIBIA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["PMS-44430-2026-55","901660868","ALE SALUD SAS","MAICAO",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["PMS-44001-2026-29","900016853","UNIDAD MEDICA WAYUU ANOUTA WAKUAIPA IPSI","RIOHACHA",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
  ["PMS-44001-2026-52","900517548","IPSI CENTRO EPIDEMIOLOGICO JEKEET AKUAITA","RIOHACHA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["PMS-44001-2026-27","825003149","IPSI SUPULA WAYUU","RIOHACHA",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["PMS-44430-2026-16","900141404","IPSI KARAQUITA","MAICAO",["1T 2026","2T 2026"],["SUBSIDIADO"]],
  ["ASB-44560-2026-68","900679383","IPS INDIGENA COTTUSHI SUSHI ANAIN WAKUA IPA IPS-I","MANAURE",["1T 2026","2T 2026"],["SUBSIDIADO","CONTRIBUTIVO"]],
];

function randomId() {
  return Math.random().toString(36).slice(2, 17);
}

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const key = url.searchParams.get('key');

  if (key !== SECRET) {
    return res.status(401).json({ error: 'Acceso denegado. Usa ?key=DUSAKAWI2026' });
  }

  const log = [];

  try {
    // 1. Autenticar
    const authRes = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: PB_EMAIL, password: PB_PASS }),
    });
    const authData = await authRes.json();
    const token = authData.token;
    if (!token) throw new Error('Auth failed: ' + JSON.stringify(authData));
    log.push('✅ Autenticado');

    // 2. Obtener actas y prestadores
    const storRes = await fetch(
      `${PB_URL}/api/collections/app_storage/records?filter=(key='actas'||key='prestadores')&perPage=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const storData = await storRes.json();
    const byKey = {};
    for (const r of (storData.items || [])) byKey[r.key] = r;

    const actas = byKey['actas']?.value || [];
    const prestadores = byKey['prestadores']?.value || [];
    const actasRecordId = byKey['actas']?.id || null;
    log.push(`📋 Actas existentes: ${actas.length}, Prestadores: ${prestadores.length}`);

    // 3. Corregir placeholders que tienen periodoEvaluado en formato incorrecto ("1T 2026" → "Marzo 2026")
    let fixCount = 0;
    for (const [contrato, nit, , , periodos, regs] of EVALUADOS) {
      for (const periodo of periodos) {
        const periodoCorr = PERIODO_MAP[periodo] || periodo;
        const mesesEsperados = MESES_CHECK[periodo] || [];
        for (const reg of regs) {
          const regLabel = reg.toUpperCase();
          // Buscar placeholder para este contrato+regimen con período que no matchea
          const idx = actas.findIndex(a =>
            (a.contrato === contrato || String(a.nit) === String(nit)) &&
            (a.regimen || 'SUBSIDIADO').toUpperCase() === regLabel &&
            (a._placeholder === true || a._placeholder === 'true') &&
            !mesesEsperados.some(m => (a.periodoEvaluado || '').toLowerCase().includes(m))
          );
          if (idx !== -1) {
            const old = actas[idx].periodoEvaluado;
            actas[idx] = { ...actas[idx], periodoEvaluado: periodoCorr };
            log.push(`🔧 CORREGIDO: ${contrato} | ${reg} | "${old}" → "${periodoCorr}"`);
            fixCount++;
          }
        }
      }
    }
    log.push(`\n🔧 Total corregidos: ${fixCount}`);

    // 4. Reconstruir set de existentes (ya con períodos corregidos)
    const existing = new Set();
    for (const a of actas) {
      existing.add(`${a.contrato||''}||${(a.regimen||'SUBSIDIADO').toUpperCase()}||${(a.periodoEvaluado||'').toLowerCase()}`);
    }

    // 5. Crear los que aún falten
    const nuevas = [];
    const ts = new Date().toISOString().replace(/[^0-9]/g,'').slice(0,14);
    let counter = 0;

    for (const [contrato, nit, nombre, municipio, periodos, regs] of EVALUADOS) {
      const prest = prestadores.find(p => p.contrato === contrato)
                 || prestadores.find(p => String(p.nit) === String(nit));

      for (const periodo of periodos) {
        const periodoCorr = PERIODO_MAP[periodo] || periodo;
        for (const reg of regs) {
          const k = `${contrato}||${reg.toUpperCase()}||${periodoCorr.toLowerCase()}`;
          if (existing.has(k)) {
            log.push(`⏭ YA EXISTE: ${contrato} | ${reg} | ${periodoCorr}`);
            continue;
          }
          counter++;
          nuevas.push({
            id: randomId(),
            numero: `HIST-${ts}-${String(counter).padStart(3,'0')}`,
            fechaCreacion: new Date().toISOString(),
            prestadorId: prest?.id || `nit_${nit}`,
            prestadorNombre: nombre,
            municipio,
            nit,
            contrato,
            regimen: reg,
            periodoEvaluado: periodoCorr,
            tipoContrato: 'ASISTENCIAL',
            servicios: [],
            observaciones: `Registrado desde hoja de seguimiento 2026. Ya evaluado ${periodoCorr}.`,
            porcentajeCumplimiento: 100,
            glosa: 0,
            guardado: true,
            _placeholder: true,
          });
          existing.add(k);
          log.push(`✅ NUEVA: ${contrato} | ${reg} | ${periodoCorr}`);
        }
      }
    }

    log.push(`\n📊 Correcciones: ${fixCount}, Nuevas: ${nuevas.length}`);

    if (fixCount === 0 && nuevas.length === 0) {
      log.push('✅ Nada que hacer — todo ya estaba correcto.');
      return res.status(200).json({ ok: true, fixed: 0, created: 0, log });
    }

    // 6. Guardar actas actualizadas + nuevas
    const actasActualizadas = [...actas, ...nuevas];
    const body = JSON.stringify({ value: actasActualizadas });

    let saveRes;
    if (actasRecordId) {
      saveRes = await fetch(
        `${PB_URL}/api/collections/app_storage/records/${actasRecordId}`,
        { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body }
      );
    } else {
      saveRes = await fetch(
        `${PB_URL}/api/collections/app_storage/records`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'actas', value: actasActualizadas }) }
      );
    }

    if (!saveRes.ok) {
      const err = await saveRes.text();
      throw new Error(`Save failed ${saveRes.status}: ${err}`);
    }

    log.push(`✅ GUARDADO. Total actas en BD: ${actasActualizadas.length}`);
    log.push('🎉 Recarga la app para ver los cambios.');

    return res.status(200).json({ ok: true, fixed: fixCount, created: nuevas.length, total: actasActualizadas.length, log });

  } catch (err) {
    log.push(`❌ ERROR: ${err.message}`);
    return res.status(500).json({ ok: false, error: err.message, log });
  }
}
