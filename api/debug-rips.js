// Debug: descarga RIPS de radicación y parsea con la misma lógica que la app
// GET /api/debug-rips?key=DUSAKAWI2026&contrato=ASB-44560-2026-09&anio=2026&mes=4&reg=RC
// GET /api/debug-rips?key=DUSAKAWI2026&contrato=ASB-44560-2026-09&anio=2026&trimestre=2T&reg=RC

const RAD_BASE  = 'https://radicacion.vercel.app';
const RAD_TOKEN = 'DUSAKAWI-RIPS-2026';
const SECRET    = 'DUSAKAWI2026';

const CUPS_URGENCIAS = new Set(['5DS002']);
const CUPS_TAB       = new Set(['601T01','601T02','601T03','602T01','602T02','603T01']);
const CUPS_HOSP      = new Set(['130B01','129B01','130B021']);
const CUPS_LAB       = new Set([
  '901001','901003','901101','901107','901232','901235','901236','901237','901304','901305',
  '901326','902204','902207','902208','902210','902211','902216','902213','902214','902220',
  '902221','903801','903802','903809','903815','903816','903818','903822','903895','903876',
  '903840','903841','903842','903843','903844','903845','903886','903862','903856','903857',
  '903868','904508','906215','906219','906220','906221','906222','906223','906225','906249',
  '906915','907002','907003','907005','907008','907009','907106','911015','911016',
  '901002','902010','902011','902045','902047','902048','902049','902121','902205','902206',
  '902217','902218','902219','902223','902224','903016','903426','903427','903436','903437',
  '903438','903439','903604','903605','903612','903613','903805','903806','903810','903811',
  '903812','903817','903819','903820','903821','903823','903824','903828','903829','903835',
  '903836','903846','903854','903855','903859','903860','903861','903863','903864','903865',
  '903866','903867','904004','904101','904103','904104','904105','904106','904107','904108',
  '904109','904201','904202','904203','904204','904902','904904','904905','904906','904911',
  '904912','904913','904914','904920','904921','904922','904924','904925','906001','906002',
  '906040','906050','906127','906128','906129','906130','906131','906132','906207','906208',
  '906211','906212','906213','906214','906216','906217','906224','906241','906242','906243',
  '906244','906245','906246','906247','906248','906317','906318','906406','906440','906441',
  '906442','906458','906459','906460','906462','906463','906464','906465','906602','906603',
  '906604','906605','906606','906610','906611','906625','906810','906812','906826','906828',
  '906831','906833','906834','906835','906836','906858','906905','906906','906907','906908',
  '906910','906911','906913','906914','907001','907004','907010','907011','907101','907102',
  '911001','911002','911003','911004','911007','911008','911009','911010','911017','911018',
  '911019','911020',
]);
const CUPS_IMAGEN = new Set([
  '870001','870003','870004','870101','870102','870103','870104','870105','870107','870108',
  '870112','870113','870131','871010','871020','871030','871040','871050','871091','871111',
  '871112','871121','871129','872002','873111','873121','873122','873204','873205','873206',
  '873210','873313','873333','873335','873340','873420','873423','873310','881401','881402',
  '881332','883312','881306','881302',
]);
const CUPS_CONSULTA = new Set([
  '890201','890301','890501','890401','890209','890309','890105','890112','890114','890101',
]);

function getTipo(c) {
  const u = c.toUpperCase();
  if (CUPS_URGENCIAS.has(u)) return 'URGENCIAS BC';
  if (CUPS_TAB.has(u))       return 'TAB';
  if (CUPS_HOSP.has(u))      return 'HOSP BAJA COMPLEJIDAD';
  if (CUPS_LAB.has(u))       return 'LABORATORIO CLINICO B y M';
  if (CUPS_IMAGEN.has(u))    return 'IMAGENOLOGIA BASICA (Rx)';
  if (CUPS_CONSULTA.has(u))  return 'CONSULTA EXTERNA Y/O MEDICINA GENERAL';
  return null;
}

function parseTxt(txt) {
  const counts = {};
  const urgKeys = new Set(); // dedup urgencias por paciente+fecha
  const svcKeys = new Set(); // dedup servicios por paciente+cups+fecha

  let inUrgencias = false;
  let inAt = false;

  for (const rawLine of txt.split('\n')) {
    const l = rawLine.trim();
    if (!l || l.startsWith('*')) continue;

    const up = l.toUpperCase();

    // Detectar secciones
    if (up.includes('ARCHIVO-URGENCIAS') || up.includes('ARCHIVO-RIPS-AU')) {
      inUrgencias = !inUrgencias; // toggle (primera vez entra, segunda vez sale)
      inAt = false; continue;
    }
    if (up.includes('ARCHIVO-OTROS SERVICIOS') || up.includes('ARCHIVO-AT')) {
      inAt = !inAt; inUrgencias = false; continue;
    }
    if (up.includes('ARCHIVO-')) { inUrgencias = false; inAt = false; continue; }

    // --- Sección URGENCIAS ---
    if (inUrgencias) {
      const parts = l.replace(/\|+$/, '').split(',');
      if (parts.length < 3) continue;
      const id = parts[2].trim().replace(/[^0-9A-Za-z]/g, '');
      if (!id || id.length < 3) continue;
      const dm = l.match(/\b(\d{4}-\d{2}-\d{2})\b/);
      const fecha = dm ? dm[1] : '';
      const k = `${id}|URGBC|${fecha}`;
      if (!urgKeys.has(k)) { urgKeys.add(k); counts['URGENCIAS BC'] = (counts['URGENCIAS BC']||0)+1; }
      continue;
    }

    // --- Sección OTROS SERVICIOS (AT) ---
    if (inAt) {
      const parts = l.replace(/\|+$/, '').split(',').map(x => x.trim());
      let cupsAt = '';
      let cupsIdx = -1;
      for (let i = 0; i < parts.length; i++) {
        if (/^[0-9][0-9A-Z]{5}$/i.test(parts[i])) { cupsAt = parts[i].toUpperCase(); cupsIdx = i; break; }
      }
      if (!cupsAt) continue;
      const tipo = getTipo(cupsAt);
      if (!tipo) continue;
      // Paciente: primer campo que parece un ID (solo dígitos, 5-15 chars)
      const pacParts = parts.slice(0, Math.min(5, parts.length));
      const pac = pacParts.find(p => /^\d{5,15}$/.test(p)) || '';
      const dm = l.match(/\b(\d{4}-\d{2}-\d{2})\b/);
      const fecha = dm ? dm[1] : '';
      // Cantidad
      let cant = 1;
      for (let i = cupsIdx+2; i < parts.length; i++) {
        const v = parseInt(parts[i], 10);
        if (!isNaN(v) && v > 0 && v < 1000) { cant = v; break; }
      }
      for (let q = 0; q < cant; q++) {
        const k = `${pac}|${cupsAt}|${fecha}|${q}`;
        if (!svcKeys.has(k)) { svcKeys.add(k); counts[tipo] = (counts[tipo]||0)+1; }
      }
      continue;
    }

    // --- Líneas normales (CONSULTAS, PROCEDIMIENTOS, etc.) ---
    const mC = l.match(/\b([0-9][0-9A-Za-z]{5})\b/);
    if (!mC) continue;
    const cups = mC[1].toUpperCase();
    const tipo = getTipo(cups);
    if (!tipo) continue;

    const parts = l.replace(/\|+$/, '').split(',');
    // Paciente: columna 2 (tipo_doc, id_pac, ...)
    const pac = (parts[2] || '').trim().replace(/[^0-9A-Za-z]/g, '');
    if (!pac || pac.length < 3) continue;
    const dm = l.match(/\b(\d{4}-\d{2}-\d{2})\b/);
    const fecha = dm ? dm[1] : '';
    const k = `${pac}|${cups}|${fecha}`;
    if (!svcKeys.has(k)) { svcKeys.add(k); counts[tipo] = (counts[tipo]||0)+1; }
  }

  return counts;
}

const TRIMS = {
  '1T': [3],
  '2T': [4,5,6],
  '3T': [7,8,9],
  '4T': [10,11,12],
};

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  if (url.searchParams.get('key') !== SECRET) return res.status(401).json({ error: 'Acceso denegado' });

  const contrato  = url.searchParams.get('contrato') || 'ASB-44560-2026-09';
  const anio      = parseInt(url.searchParams.get('anio') || '2026');
  const regParam  = url.searchParams.get('reg') || 'RC';
  const trimParam = url.searchParams.get('trimestre');
  const mesParam  = url.searchParams.get('mes');

  const meses = trimParam ? (TRIMS[trimParam] || []) : mesParam ? [parseInt(mesParam)] : [4];

  const resultados = [];
  const totalCounts = {};

  for (const mes of meses) {
    const ripsUrl = `${RAD_BASE}/api/rips-ext?contrato=${encodeURIComponent(contrato)}&anio=${anio}&mes=${mes}&regimen=${regParam}&formato=txt`;
    let txt = '', http = 0, bytes = 0;
    try {
      const r = await fetch(ripsUrl, { headers: { 'x-token': RAD_TOKEN } });
      http = r.status;
      txt = await r.text();
      bytes = Buffer.byteLength(txt, 'utf8');
    } catch (e) {
      resultados.push({ mes, error: e.message }); continue;
    }

    const hasRips = /ARCHIVO-USUARIOS|ARCHIVO-CONSULTAS|ARCHIVO-PROCEDIMIENTOS|ARCHIVO-URGENCIAS/i.test(txt);
    const counts = hasRips ? parseTxt(txt) : {};
    const urgLineas = (txt.match(/\n/g)||[]).length; // rough

    // Contar líneas brutas en sección URGENCIAS
    let urgBruto = 0;
    { let inU = false;
      for (const l of txt.split('\n')) {
        const u = l.toUpperCase();
        if (u.includes('ARCHIVO-URGENCIAS')) { inU = !inU; continue; }
        if (u.includes('ARCHIVO-') && !u.includes('ARCHIVO-URGENCIAS')) { inU = false; }
        if (inU && l.trim().length > 10 && !l.trim().startsWith('*') && !l.trim().startsWith('-')) urgBruto++;
      }
    }

    resultados.push({ mes, http, bytes, hasRips, urgLineasBrutas: urgBruto, counts });

    for (const [tipo, n] of Object.entries(counts)) {
      totalCounts[tipo] = (totalCounts[tipo]||0) + n;
    }
  }

  // Totales esperados según archivos del usuario (hardcoded para comparar)
  const esperadoManual = {
    'LABORATORIO CLINICO B y M': 10,
    'IMAGENOLOGIA BASICA (Rx)': 1,
    'TAB': 2,
    'URGENCIAS BC': 10,
  };

  const diferencias = {};
  const todosKeys = new Set([...Object.keys(totalCounts), ...Object.keys(esperadoManual)]);
  for (const k of todosKeys) {
    const rad = totalCounts[k] || 0;
    const man = esperadoManual[k] || 0;
    if (rad !== man) diferencias[k] = { radicacion: rad, manual_usuario: man, diff: rad - man };
  }

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    contrato, anio, regimen: regParam, trimestre: trimParam || `mes${mesParam}`,
    meses: resultados,
    totalCounts,
    esperadoDesdeArchivosUsuario: esperadoManual,
    diferencias,
    coinciden: Object.keys(diferencias).length === 0,
  });
}
