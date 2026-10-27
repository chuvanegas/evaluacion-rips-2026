// Debug: descarga los RIPS de radicación y reporta conteos por sección
// GET /api/debug-rips?key=DUSAKAWI2026&contrato=ASB-44560-2026-09&anio=2026&mes=4&reg=RC

const RAD_BASE  = 'https://radicacion.vercel.app';
const RAD_TOKEN = 'DUSAKAWI-RIPS-2026';
const SECRET    = 'DUSAKAWI2026';

function contarSeccion(txt, nombreSeccion) {
  const inicio = txt.indexOf(`ARCHIVO-${nombreSeccion}`);
  if (inicio < 0) return { lineas: 0, muestra: [] };
  const fin = txt.indexOf(`ARCHIVO-${nombreSeccion}`, inicio + 10);
  const bloque = fin > inicio ? txt.slice(inicio, fin) : txt.slice(inicio);
  const lineas = bloque.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 10 && !l.startsWith('*') && !l.startsWith('-') && !l.startsWith('�'));
  return { lineas: lineas.length, muestra: lineas.slice(0, 3) };
}

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  if (url.searchParams.get('key') !== SECRET) return res.status(401).json({ error: 'Acceso denegado' });

  const contrato = url.searchParams.get('contrato') || 'ASB-44560-2026-09';
  const anio     = url.searchParams.get('anio') || '2026';
  const mes      = url.searchParams.get('mes') || '4';
  const reg      = url.searchParams.get('reg') || 'RC';

  const ripsUrl = `${RAD_BASE}/api/rips-ext?contrato=${encodeURIComponent(contrato)}&anio=${anio}&mes=${mes}&regimen=${reg}&formato=txt`;

  let txt = '';
  let httpStatus = 0;
  try {
    const r = await fetch(ripsUrl, { headers: { 'x-token': RAD_TOKEN } });
    httpStatus = r.status;
    txt = await r.text();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  const secciones = ['USUARIOS','FACTURAS','CONSULTAS','PROCEDIMIENTOS','URGENCIAS','MEDICAMENTOS','OTROS SERVICIOS'];
  const reporte = {};
  for (const s of secciones) {
    reporte[s] = contarSeccion(txt, s);
  }

  const bytes = Buffer.byteLength(txt, 'utf8');

  return res.status(200).json({
    url: ripsUrl,
    http: httpStatus,
    bytes,
    secciones: reporte,
    primeras10Lineas: txt.split('\n').slice(0, 15).map(l => l.trim()),
  });
}
