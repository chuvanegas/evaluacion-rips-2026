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
  const tieneReg = (contrato, anio, mes, reg) =>
    registros.some(r =>
      r.contrato === contrato &&
      r.periodo_anio === anio &&
      r.periodo_mes === mes &&   // billing month offset: atención mes M → factura M+1
      r.regimen === reg &&
      ((r.n_usuarios > 0) || (r.n_servicios > 0) || (r.meses_rips > 0))
    );

  const trimActa = (contrato, nit, regLabel, t) =>
    actas.some(a => {
      const mismoContrato = a.contrato === contrato;
      const mismoNit = nit && String(a.nit) === String(nit);
      if (!mismoContrato && !mismoNit) return false;
      if ((a.regimen || 'SUBSIDIADO').toUpperCase() !== regLabel) return false;
      return t.mesesES.some(mes => (a.periodoEvaluado || '').toLowerCase().includes(mes.toLowerCase()));
    });

  // Solo contratos registrados en la app
  const pendientes = [];
  for (const c of contratos) {
    const prest = prestadores.find(p =>
      p.contrato === c.contrato || String(p.nit) === String(c.nit)
    );
    if (!prest) continue;  // no registrado en la app

    for (const reg of ['RS', 'RC']) {
      const regLabel = reg === 'RC' ? 'CONTRIBUTIVO' : 'SUBSIDIADO';
      for (const t of TRIMS) {
        const completo = t.meses.every(m => tieneReg(c.contrato, t.anio, m, reg));
        if (!completo) continue;

        const tieneActa = trimActa(c.contrato, c.nit ? String(c.nit) : null, regLabel, t);
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
