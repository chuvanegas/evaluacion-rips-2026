# Changelog — Evaluación Cápita Asistencial

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
