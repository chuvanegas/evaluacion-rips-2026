import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configuración para manejar payloads grandes (archivos RIPS)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir archivos estáticos
app.use(express.static(__dirname));

// --- Base de datos en memoria (Simulación) ---
// En producción, esto se conectaría a MongoDB, PostgreSQL, etc.
let db = {
  config: {
    metas: [],
    scale: 1
  },
  session: {
    registros: [],
    usuarios: []
  }
};

// --- API Endpoints ---

// Obtener Configuración
app.get('/api/config', (req, res) => {
  res.json(db.config);
});

// Guardar Configuración
app.post('/api/config', (req, res) => {
  const { metas, scale } = req.body;
  if (metas !== undefined) db.config.metas = metas;
  if (scale !== undefined) db.config.scale = scale;
  res.json({ success: true, message: "Configuración guardada en servidor" });
});

// Obtener Sesión (Registros y Usuarios)
app.get('/api/session', (req, res) => {
  res.json(db.session);
});

// Guardar Sesión
app.post('/api/session', (req, res) => {
  const { registros, usuarios } = req.body;
  if (registros) db.session.registros = registros;
  if (usuarios) db.session.usuarios = usuarios;
  console.log(`[Server] Datos guardados: ${registros?.length || 0} registros`);
  res.json({ success: true, message: "Sesión guardada en servidor" });
});

// Limpiar Sesión
app.delete('/api/session', (req, res) => {
  db.session.registros = [];
  db.session.usuarios = [];
  res.json({ success: true, message: "Datos del servidor limpiados" });
});

// Fallback para SPA (Single Page Application)
// Redirige cualquier ruta no reconocida al index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Servidor Evaluación Cápita Asistencia corriendo en http://localhost:${port}`);
  console.log(`📡 API lista en http://localhost:${port}/api`);
});