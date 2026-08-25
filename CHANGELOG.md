# Changelog — Evaluación Cápita Asistencial

## v2.3 — 2026-08-25

### Sincronización bidireccional de prestadores entre dispositivos
- La carga inicial ahora **fusiona** local + nube (antes solo tomaba la nube, perdiendo prestadores creados offline).
- El poll de 60 segundos también fusiona en lugar de reemplazar: si el PC A crea un prestador sin conexión, en la próxima sincronización se sube a Supabase y queda disponible para todos los demás PCs.
- Si un PC tiene prestadores que la nube no conoce, el cambio de estado fuerza la escritura en Supabase vía el `useEffect` de auto-guardado.

### Corrección: Nuevo prestador siempre inicia como ASISTENCIAL
- Al hacer clic en "Nuevo Prestador", el formulario ahora se inicializa con `tipoContrato: 'ASISTENCIAL'` y las metas estándar de ASISTENCIAL en cero — nunca hereda los tipos del prestador activo.
- Bug anterior: si el último prestador activo era PAI, el formulario de nuevo prestador heredaba los biológicos PAI. Al generar el acta, aunque el dropdown mostraba "ASISTENCIAL", las metas tenían tipos PAI y el acta salía con servicios de vacunas en cero.

### Corrección: Sincronización Supabase — actas locales perdidas
- La sincronización periódica (60 segundos) ahora detecta actas que existen localmente pero no en la nube y fuerza su subida.
- Bug anterior: si un PC tenía actas creadas localmente que Supabase no conocía, el poll comparaba `result.length === prev.length` y devolvía `prev` sin cambio de referencia → el `useEffect` de auto-guardado no se disparaba → las actas nunca llegaban a Supabase. Esto explicaba la diferencia de 112 vs 103 actas entre dispositivos.

## v2.2 — 2026-08-20

### Ejecutado dinámico en Vista Previa
- **Vista Previa del Acta siempre refleja RIPS cargados:** `ActaPreview` recibe `liveTypeCount` (conteos vivos por tipo de servicio) y los usa para mostrar ejecutado, % cumplimiento y totales. Ya no depende del valor guardado en el acta — si tienes los RIPS cargados, la gráfica y tabla del acta se actualizan en tiempo real.
- **PAI en Vista Previa:** el tipo 'PAI' recibe la suma de todos los biológicos (`TIPOS_PAI`) del `typeCount` activo, por lo que el acta PAI muestra el total real de vacunas aplicadas.

### Botón "Limpiar RIPS"
- Visible para todos los usuarios (antes era solo admin).
- Limpia registros cargados, usuariosMap y prestador detectado.
- Mensaje de confirmación aclarado: **las actas y prestadores NO se borran**.

### Migración automática de actas PAI viejas
- Al cargar la app (localStorage) y al sincronizar con Supabase, se detectan automáticamente las actas PAI con la estructura vieja (14 filas individuales de vacunas) y se consolidan en una sola fila `{tipo: 'PAI', programado: suma, ejecutado: suma}`.
- No requiere ninguna acción del usuario.

### `useEffect` de auto-consolidación PAI
- Cuando se abre un acta PAI en el editor inline, un `useEffect` detecta si tiene vacunas individuales y las consolida. Además, si los RIPS del prestador PAI están cargados (`detectedPrestadorId` coincide), actualiza el ejecutado desde `chartData` automáticamente.

## v2.1 — 2026-08-20

### Nuevos tipos de contrato
- **CAPITA AMPLIADA:** Incluye todos los servicios de ASISTENCIAL más PEDIATRIA, NUTRICION y PSICOLOGIA. Tema visual verde esmeralda.
- **PAI (Programa Ampliado de Inmunización):** 14 biológicos mapeados a sus CUPS (993102–993522). Parsea archivos `ARCHIVO-PROCEDIMIENTOS` AP. El dashboard muestra una sola barra "PAI" con el total de todas las vacunas aplicadas. Tema visual naranja.

### Mapeo de CUPS PAI
| Biológico | CUPS |
|---|---|
| BCG (Tuberculosis) | 993102 |
| Hepatitis B | 993503 |
| Polio | 993501 |
| Pentavalente | 993130 |
| Rotavirus | 993512 |
| Neumococo | 993106 |
| Influenza / Influenza estacional | 993104 |
| SRP (Sarampión, Rubeola, Paperas) | 993522 |
| Fiebre Amarilla | 993504 |
| Varicela | 993509 |
| Hepatitis A | 993502 |
| DPT / TDAP | 993122 |
| VPH | 993513 |
| TD (Toxoide Tetánico-Diftérico) | 993120 |

### Mejoras de UI
- **Renuencias filtradas por contrato:** La sección "Renuencias y Búsquedas Fallidas" solo muestra los servicios del tipo de contrato del prestador activo (PAI ve solo vacunas, ASISTENCIAL ve solo servicios asistenciales, etc.).
- **Dashboard PAI unificado:** Un solo bar "PAI" en la gráfica agrupa todos los biológicos. Las renuencias individuales por vacuna siguen disponibles para ajuste fino.
- **`typeCount` expuesto desde useMemo:** Permite que la sección Renuencias lea conteos individuales por tipo incluso cuando el chart los agrupa (caso PAI).

## v2.0 — 2026-08-20 (versión estable base)

### Correcciones críticas
- **MEDICAMENTOS conteo correcto:** Se corrigió bug donde nombres de medicamento truncados a 30 chars (ej. `"CLOPIDROGEL 75 mg (PLATEMAX) M"`) disparaban falsamente el detector de sección USUARIOS, descartando silenciosamente cientos de líneas de la misma sección. Fix: la auto-detección de USUARIOS no corre dentro de sección MEDICAMENTOS.
- **Columna de cantidad correcta:** Se usa `CantidadUnidadMedida` (columna índice 16) en lugar del consecutivo de factura. Para 3 meses se pasó de ~767 a ~7,515 registros correctos.
- **Acumulación de uploads:** Los archivos RIPS se acumulan entre uploads (antes cada upload reemplazaba todo). Deduplicación por `paciente|código|fecha` entre archivos.
- **Entrada Vite faltante:** Se agregó `<script type="module" src="/index.tsx">` al `index.html` (sin esto el bundle JS no se generaba y la app quedaba en blanco).

### Mejoras de UI
- **Impresión limpia:** El PDF generado con "Imprimir / PDF" ahora muestra solo el contenido del acta, sin la navegación ni botones de la app. Se usa `#acta-print-portal` con `@media print`.
- **Aviso de guardado:** El banner "NO se guardará automáticamente" solo aparece en pestaña Formulario, no en Vista Previa.
- **Logo DUSAKAWI:** Restaurado `public/logo-dusakawi.jpg` que faltaba en el repositorio.
- **Mensaje diagnóstico:** El mensaje de éxito al cargar RIPS muestra `(X medicamentos, Y otros servicios)` para facilitar verificación.

### Infraestructura
- Se agrega `package-lock.json` al repositorio.
- Se documenta el sistema en `CLAUDE.md` y `CHANGELOG.md`.
