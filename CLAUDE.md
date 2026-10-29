# Evaluación Cápita Asistencial — Guía para Claude

## Qué es este proyecto

SPA (Single Page Application) en React + TypeScript desplegada en Vercel. Permite a DUSAKAWI EPSI evaluar el cumplimiento de metas asistenciales de prestadores de salud, procesando archivos RIPS (texto TXT y JSON) para generar actas de evaluación.

## Repositorios y despliegue

| Repositorio | Rama | Propósito |
|---|---|---|
| `chuvanegas/evaluacion-rips-2026` | `claude/general-improvements-TGzCd` | Desarrollo |
| `elprimordialjd29/evaluacion-capita-asistencial` | `main` | Producción (Vercel) |

- **URL producción:** `evaluacion-rips-2026.vercel.app`
- **Vercel:** auto-deploya desde `elprimordialjd29/evaluacion-capita-asistencial` rama `main`
- **SIEMPRE** hacer push a los dos repos en cada cambio

### Tokens de acceso (push sin proxy)
```bash
# chuvanegas (desarrollo) — token en el historial de la sesión Claude
git -c http.proxy="" -c https.proxy="" push \
  "https://<TOKEN_CHUVANEGAS>@github.com/chuvanegas/evaluacion-rips-2026.git" \
  claude/general-improvements-TGzCd

# elprimordialjd29 (producción Vercel) — token en el historial de la sesión Claude
git -c http.proxy="" -c https.proxy="" push --force \
  "https://<TOKEN_ELPRIMORDIALJD29>@github.com/elprimordialjd29/evaluacion-capita-asistencial.git" \
  claude/general-improvements-TGzCd:main
```

> El proxy del entorno bloquea pushes directos; usar siempre `-c http.proxy="" -c https.proxy=""`.
> Los tokens reales están en el historial de conversación de Claude — pedirlos al usuario si no están en contexto.

### Fix tracking ref tras push
Después de cada push con URL con token, el tracking ref puede quedar desconfigurado. Corregir con:
```bash
git fetch origin && git branch --set-upstream-to=origin/claude/general-improvements-TGzCd claude/general-improvements-TGzCd
```

---

## Base de datos — PocketBase en VPS Contabo (v2.10+)

Desde v2.10 la app usa **PocketBase** en lugar de Supabase.

| Dato | Valor |
|---|---|
| **Servidor** | VPS Contabo — `207.180.243.127` |
| **Panel admin** | `https://evaluacion-db.duckdns.org/_/` |
| **API** | `https://evaluacion-db.duckdns.org` |
| **Admin email** | `jd_vanegas@hotmail.com` |
| **Colección** | `app_storage` (key-value JSON, 11 registros) |
| **SSL** | Let's Encrypt via nginx reverse proxy — renueva automáticamente |
| **DuckDNS token** | `7336e4f9-ef84-42e7-af5f-f065f031fad1` (cuenta `elprimordialjd29@gmail.com`) |

### Acceso SSH al VPS
```bash
ssh root@207.180.243.127
# Contraseña: V@negas1920
```
> Cambiar contraseña SSH cuando sea posible (`passwd`).

### Servicios en el VPS
- **PocketBase**: `systemctl status pocketbase` — puerto 8090 interno
- **nginx**: reverse proxy con SSL en puerto 443 → proxea a 8090
- **certbot**: renovación automática de certificado (systemd timer)

### Estructura de app_storage
Cada key es un string; value es un array/objeto JSON:

| key | Contenido |
|---|---|
| `prestadores` | Array de todos los prestadores registrados |
| `actas` | Array de todas las actas generadas |
| `renuncias` | Array de renuencias/búsquedas fallidas |
| `appUsers` | Array de usuarios de la app |
| `funcionarios` | Array de funcionarios firmantes |
| `firmasGlobales` | Objeto con firmas globales del coordinador |
| `customCups` | Array de CUPS personalizados |
| `rips_dashboard_metas` | Metas globales por tipo de servicio |
| `rips_dashboard_scale` | Escala de meses actual |
| `rips_dashboard_registros` | Registros RIPS cargados (sesión) |
| `rips_dashboard_usuarios` | Mapa de usuarios detectados en RIPS |

### Cliente PocketBase (`services/supabaseClient.ts`)
Exporta `CloudStorage` con la misma interfaz que antes (Supabase):
- `CloudStorage.get(key)` — GET con filter por key
- `CloudStorage.set(key, value)` — upsert (GET para encontrar ID, luego PATCH o POST)
- `CloudStorage.getAll(keys[])` — GET con filter OR de múltiples keys

El token de admin se cachea 11 horas para evitar re-autenticación frecuente.

### Migración desde Supabase
Los datos de Supabase (`wczamyidhyqwtxvjgwgu.supabase.co`) fueron migrados a PocketBase el 2026-09-15. Supabase ya no se usa pero los datos siguen ahí como respaldo histórico.

---

## Arquitectura

```
App.tsx                  ← componente raíz, lógica principal (~4200+ líneas)
index.tsx                ← punto de entrada React
index.html               ← HTML con print CSS y portal de impresión
types.ts                 ← interfaces TypeScript (RipsRecord, Acta, Prestador, etc.)
components/
  ActaModal.tsx          ← formulario + Vista Previa + impresión de actas
  ReportesTab.tsx        ← tab de reportes y ranking CUPS/pacientes
utils/
  logic.ts               ← lógica de cálculo de metas y cumplimiento
services/
  storageService.ts      ← persistencia de sesión RIPS (registros grandes)
  supabaseClient.ts      ← cliente CloudStorage (ahora apunta a PocketBase)
public/
  logo-dusakawi.jpg      ← logo para el header del acta
```

---

## Flujo de datos principal

```
Archivos RIPS (TXT / JSON)
        ↓  processFiles()  en App.tsx
registros: RipsRecord[]        ← estado React (se acumula entre uploads)
        ↓  useMemo()
chartData / typeCount          ← conteo por tipo de servicio
        ↓
Dashboard → barra "Ejecutado (Real)"
```

### Estado clave en App.tsx
- `registros: RipsRecord[]` — todos los registros procesados, acumulados entre uploads
- `metas: ServiceTypeMeta[]` — metas mensuales por tipo de servicio del prestador activo
- `actas: Acta[]` — actas guardadas en PocketBase
- `detectedPrestadorId` — ID del prestador detectado en los archivos cargados
- `isAuditMode` — `true` cuando hay registros pero no hay prestador seleccionado
- `supabaseStatus` — estado del ping periódico a PocketBase (`'ok'|'error'|'checking'|'unknown'`)
- `expandedNits` — Set de NITs abiertos en la lista de prestadores (pestaña Prestadores)
- `dashExpandedNits` — Set de NITs abiertos en el panel Prestadores del Dashboard
- `selectedDashPrestador` — legacy (ya no se usa para selección en dashboard)
- `otrosLineas` — líneas de Otros Servicios (no cuentan); base de `urgVinculados` (v2.18)

---

## Parseo RIPS TXT (crítico — errores anteriores documentados)

### Formato archivo AM (Medicamentos)
Columnas separadas por coma, **índice 0-based**:

| Índice | Contenido |
|---|---|
| 0 | NIT prestador |
| 1 | Tipo documento (CC, TI…) |
| **2** | **Número documento paciente** ← `pacMed` |
| 3 | Número de cuenta |
| 4–5 | (vacíos) |
| **6** | **Fecha dispensación** (`2026-04-01 11:17`) ← `fechaMed` |
| 7 | Diagnóstico principal |
| 8 | Diagnóstico secundario |
| 9 | Código vía |
| **10** | **Código medicamento** ← `codMed` |
| **11** | **Nombre genérico** (truncado a 30 chars) ← `nombreMed` |
| 12–15 | Otros campos |
| **16** | **CantidadUnidadMedida** ← `cantidad` (loop `for q < cantidad`) |
| 17–24 | Otros campos |
| 25 | Consecutivo dentro factura |

### Bug corregido en v2.0 — Auto-detección falsa de USUARIOS
Los nombres de medicamento se truncan a **30 caracteres**. Algunos terminan en `M` o `F` suelto (ej: `"CLOPIDROGEL 75 mg (PLATEMAX) M"`), lo que disparaba falsamente el detector automático de sección USUARIOS.

**Fix:** La auto-detección de USUARIOS no corre cuando `section === "MEDICAMENTOS"`.

### Deduplicación de medicamentos
Clave de dedup: `${paciente}|${codMed}|${fecha}` — una dispensación única por paciente+código+fecha.

### Exclusión de OXÍGENO
Se excluyen líneas donde `nombreMed` coincide con `/OXIGENO|OXIGEN|GAS\s+MED|OXYGEN/i`.

### Detección de secciones (App.tsx ~línea 1265)
```
"ARCHIVO-MEDICAMENTOS" → section = "MEDICAMENTOS"
"ARCHIVO-OTROS SERVICIOS" → section = "SERVICIOS"
"ARCHIVO-USUARIOS" → section = "USUARIOS"
"ARCHIVO-URGENCIAS" → inUrgenciasSection = true
```

---

## Impresión / PDF de actas

- Botón "Imprimir / PDF" copia el HTML del acta a `#acta-print-portal`
- CSS en `index.html`: `@media print { #root { display: none } #acta-print-portal { display: block } }`
- El logo `logo-dusakawi.jpg` debe estar en `public/`

---

## Auditoría de urgencias, duplicados y renuencias en el acta (v2.18)

### Diagnóstico 25% → 15% → 8% (contrato ASB-44560-2026-09, Contributivo, 2T)
Verificado ejecutando el parser real de `processFiles` sobre los 3 TXT de radicación (abr/may/jun):
- Los RIPS contienen: LAB 10, IMAGEN 1, TAB 2, URGENCIAS 10, HOSP 0 → **23/276 = 8%**. **Cero duplicados** (ninguna combinación paciente+servicio+fecha se repite).
- El acta del **15%** tenía URGENCIAS = 29: las 10 reales + **19 líneas de Otros Servicios** (insumos MAT…, sala de observación 5DSB01) contadas como urgencia por el bug de `inUrgenciasSection` (no se cerraba; las líneas de Otros Servicios caían en el handler de urgencias porque se evalúa antes que `inAtSection`). Los traslados 601T02 no se afectaban porque los procesa el pre-scan `atLineSet`.
- No eran duplicados de múltiples radicaciones (la explicación de v2.17 era incorrecta).

### Carga sin filtrar + revisión de duplicados
- `processFiles` ya **no filtra** duplicados: `setRegistros(prev => [...prev, ...newRegistros])`. Solo MEDICAMENTOS mantiene su `medDupSet` (la cantidad genera copias legítimas).
- `duplicatesList` (useMemo) ahora incluye **todos los tipos excepto MEDICAMENTOS** (`TIPOS_SIN_DUPLICADOS = ['MEDICAMENTOS']`; antes excluía también URGENCIAS y HOSP, por eso nunca se veían). Cada item lleva `tipo`.
- `ActaModal` recibe `duplicates` + `onLimpiarDuplicados`:
  - Banner naranja `DuplicatesBanner` con lista (paciente, servicio, fecha, copias) y botón **"Quitar duplicados"** → limpia `registros` y recalcula `ejecutado` del acta.
  - En la columna RIPS se muestra **"incl. N dup."** por servicio cuando el conteo incluye repetidos.

### Duplicados por servicio (v2.21 — igual que vinculados de Urgencias)
- Aplica a **todos los servicios y todos los prestadores** (excepto MEDICAMENTOS). En contratos PAI los duplicados de cada vacuna se agrupan en la fila `PAI`.
- Columna RIPS: número **único** (`ejecutado − copias extra`) + enlace **"+N duplicados"** + casilla **"Sumar (k/N)"** (marca/desmarca todas; estado intermedio si es parcial).
- El enlace abre la lista del servicio (paciente, fecha, código, descripción, veces, suma) con casilla por grupo y casilla "todas". **Por defecto todas marcadas** (los RIPS se cuentan completos); se desmarcan las que la auditoría no acepta.
- **No borra registros**: se guarda en el acta `duplicadosQuitadosSel` (ids `paciente|cups|fecha`) y `duplicadosQuitados` (copias extra excluidas). `totalEjecutado = ejecutado + renuencias + vinculados − duplicadosQuitados` (también en Vista Previa/PDF). Reversible en cualquier momento.
- Banner superior: resumen (se cuentan / excluidas), "Ver detalle", **"Excluir todas"** y **"Contar todas"**. Se eliminó el antiguo `quitarDuplicados` de App.tsx que borraba registros.

### Renuencias editables en el acta
- `ActaServicio` agrega `renuencias?: number` y `vinculados?: number`. `ejecutado` = conteo RIPS puro.
- `handleGenerarActa` toma `ejecutado` de `typeCount` (ya no de `chartData`, que mezclaba renuencias).
- **Desde v2.20 `renuencias` sale de los registros de la pestaña Renuencias** (`renuncias` filtradas por contrato o NIT + régimen + `tipoServicio` + mes contenido en `periodoEvaluado` del acta), igual que el preview de radicación. Antes venía de `metas[].renuencias` (números manuales del Dashboard, persistidos en `rips_dashboard_metas`), que se arrastraban de un prestador a otro (ej. 7 en ENFERMERIA y 1 en IMAGEN en ANASHIWAYA sin renuncias registradas). En el acta el valor sigue siendo editable.
- Tabla del Formulario: **Programado | RIPS | Renuencias (input rosado) | Total | %**.
- `totalEjecutado(srv) = ejecutado + renuencias + vinculados`; `pct()`, `ejec()` y la Vista Previa/PDF (`getLiveEjec`) lo usan.

### Líneas de Otros Servicios vinculadas a urgencias
- Nuevo estado `otrosLineas` (App.tsx): cada línea de la sección OTROS SERVICIOS se guarda aparte (no suma a ningún servicio). Código = columna `fecha + 2` (formato AT: `…,fecha,tipoServicio,código,nombre,cantidad,…`). Se limpia cuando `registros` queda vacío.
- `urgVinculados` (useMemo): líneas de `otrosLineas` con mismo `paciente|fecha` que una urgencia, excluyendo traslados `\d{3,4}T\d{2}`.
- En el acta, fila URGENCIAS BC: **"+N vinculados"** (abre lista paciente/fecha/código/descripción) y casilla **"Sumar"** → guarda `srv.vinculados = N`. Ej. ASB-44560-2026-09 2T: sin sumar 8%, sumando 19 → 15%.
- **v2.19 — selección por línea:** la lista tiene una casilla por línea y una casilla "todas" en el encabezado. "Sumar (k/N)" en la fila de Urgencias marca o desmarca todas (queda en estado intermedio si es parcial). Se guarda `srv.vinculadosSel` (claves `paciente|fecha|código|índice`) y `srv.vinculados = vinculadosSel.length`. Actas anteriores sin `vinculadosSel`: si `vinculados >= N` se muestran todas marcadas.

### Fix fecha de urgencias
La fecha de ingreso viene pegada al código del prestador (`4456000345072026-05-05 19:31`), así que `\b(\d{4}-…)\b` la saltaba y tomaba la de egreso. Ahora se usa la primera fecha sin `\b`: `l.match(/(\d{4}-\d{2}-\d{2})/)`.

### Verificar el parser sin navegador
Extraer de App.tsx el bloque entre `const getTipo = (cups: string): string =>` y `// Detectar prestador desde nombre de archivos TXT`, envolverlo en una función con `ripsFiles` simulados (`text: async () => readFileSync(p,'latin1')`), empaquetar con `npx esbuild --bundle --platform=node` y ejecutar con node. Requiere `npm install`.

---

## Deduplicación de RIPS y revisión de actas (v2.17)

> ⚠️ La dedup automática y la explicación de "29 urgencias = duplicados de radicaciones" de esta sección fueron **reemplazadas en v2.18** (ver sección anterior).

### Deduplicación por paciente+cups+fecha

El flujo de radicación descarga los archivos TXT combinando TODAS las radicaciones presentadas para un período (radicación 1, 2, 3…). Esto resulta en que los mismos encuentros clínicos aparecen varias veces (e.g., 29 líneas de urgencias para 10 encuentros reales).

**Lógica de dedup en `processFiles` (App.tsx ~línea 1912):**
- Para **MEDICAMENTOS**: dedup propio (`medDupSet`) dentro de `processFiles`, por `paciente|cups|fecha` — una dispensación única por código+fecha.
- Para el **resto de tipos** (urgencias, laboratorio, TAB, imagen, etc.): dedup global en `setRegistros` por `paciente|cups|fecha`. Elimina registros idénticos acumulados de múltiples radicaciones.
- La clave de urgencias usa `cups = 'URGBC'` (código interno, no CUPS real).

**Aviso al usuario:** si se filtran duplicados, el mensaje de éxito lo indica:
> "Añadidos 10 registros únicos · ⚠️ 19 duplicados filtrados (misma paciente+servicio+fecha de múltiples radicaciones)"

### Fix toggle de sección URGENCIAS (`inUrgenciasSection`)

**Bug anterior:** `inUrgenciasSection = true` siempre (header abre Y cierra ambos igual). Con múltiples radicaciones en un TXT, el header de cierre no apagaba la sección.

**Fix v2.17:** Toggle `inUrgenciasSection = !inUrgenciasSection`. También se añadió reset explícito (`inUrgenciasSection = false`) al entrar a MEDICAMENTOS, USUARIOS y OTROS SERVICIOS. Esto asegura que solo las líneas dentro de cada bloque ARCHIVO-URGENCIAS se cuenten como urgencias.

```javascript
// ANTES (bug):
inUrgenciasSection = true;  // nunca se apagaba con el header de cierre

// DESPUÉS (fix):
inUrgenciasSection = !inUrgenciasSection;  // toggle: abre y cierra
// + en MEDICAMENTOS, USUARIOS, OTROS SERVICIOS:
inUrgenciasSection = false;
```

### Modal de revisión para actas (manual y automático)

**Antes v2.17:** `handleGenerarActa` hacía `setInlineActa(newActa); setActiveTab('actas')` — navegaba directamente a la pestaña Actas. El flujo automático no daba opción de revisar antes de guardar.

**Desde v2.17:** `handleGenerarActa` hace `setEditingActa(newActa); setShowActaModal(true)` — abre el **ActaModal flotante** para revisión. Tanto el flujo **manual** (carga de RIPS + "Generar Acta") como el **automático** (radicación → "Procesar y Generar Acta") muestran el mismo modal con:
- Gráfica de cumplimiento
- Tabla de servicios con % por tipo
- Campos editables (el usuario puede corregir valores antes de guardar)
- Botón "Guardar" → añade a `actas` → auto-save a PocketBase
- Botón "X" → cierra sin guardar

### Badge y panel "Listos para evaluar" — fixes v2.17

- `trimActa()` ya detectaba actas manuales y automáticas (usa `actas` de estado → todas las actas guardadas, sin importar cómo se crearon).
- **Badge de pendientes** (useEffect ~línea 665): añadidas dependencias `actas` y `prestadores` → el conteo se actualiza en tiempo real al guardar nuevas actas.
- **Filtro de contratos**: el badge ahora filtra solo contratos registrados en la app (`prestadores.some(p => p.contrato === c.contrato)`), igual que el panel visual. Antes podía mostrar contratos de otras EPSI.

---

## Módulo Radicación — "Listos para evaluar" (v2.16)

Panel en el Dashboard (solo visible para admin) que muestra contratos pendientes de evaluación cruzando datos de `radicacion.vercel.app` con las actas guardadas.

### Reglas críticas
- **Solo se muestran contratos registrados en la app.** Filtro: `prestadores.some(p => p.contrato === c.contrato || String(p.nit) === String(c.nit))`. Sin este filtro aparecen contratos de otras EPSI en los datos de radicación.
- **Trimestre completo:** los 3 meses del trimestre deben tener registros en radicación (`trimCompleto`).
- **Sin acta existente:** se omiten trimestres que ya tienen acta para ese contrato+régimen+período (`trimActa`).
- **Radicación con datos:** contratos sin ninguna radicación no aparecen.

### Prestador por contrato + régimen (v2.23 → v2.25)
- **Cada régimen es un registro de prestador aparte con sus propias metas** (el subsidiado siempre tiene metas mayores que el contributivo). Nunca usar las metas de un régimen para el otro.
- En radicación ambos regímenes suelen venir con el **mismo número de contrato**, pero el registro de la app puede tenerlo escrito distinto (espacios, guiones, prefijo, dígito de verificación en el NIT…).
- `matchPrestadorRad(contrato, nit, reg)` (App.tsx) devuelve `{ p, modo, candidatos }`:
  1. `exacto` — contrato normalizado (`normContrato`: mayúsculas, sin espacios, guiones unicode → `-`) + régimen.
  2. `nit` — mismo NIT (`normNit`: solo dígitos, primeros 9) + régimen; si hay varios contratos se elige el más parecido (`simContrato`: grupos de dígitos iguales en la misma posición). Ej. JEKEET tiene 2 contratos por régimen.
  3. `otroRegimen` — solo si no existe ningún registro del régimen: usa el del otro régimen y el preview muestra aviso.
  4. `ninguno`.
  `findPrestadorRad` = `matchPrestadorRad(...).p`. Lo usan los chips de trimestre, `doEvalDirect`, "Período personalizado" (`radSelector.pFound` conserva la elección del preview) y `handleEvaluar`.
- Preview: selector **"Metas del contrato registrado"** con todos los registros del contrato/NIT (contrato · régimen) para elegir manualmente; aviso azul si se emparejó por NIT con otro número de contrato; aviso ámbar si se usa el otro régimen o si ambos regímenes tienen metas idénticas.
- Verificado con prueba unitaria (8 casos) extrayendo las funciones de App.tsx y ejecutándolas con node.
- v2.24: el botón "Sí, crear {régimen complementario}" ya no copia las metas (inicia en cero).

### Refs de control (evitan stale closure / async React)
| Ref | Propósito |
|---|---|
| `radForcedPrestId` | Fuerza el prestador detectado tras processFiles (evita que NIT de otro prestador sobreescriba) |
| `radForcedReg` | Fuerza el régimen ('SUBSIDIADO'/'CONTRIBUTIVO') en handleGenerarActa |
| `radForcedScale` | Fuerza el número de meses (evita auto-detección por fechas de registros que incluyen mes anterior) |
| `radPeriodoOverride` | Texto del período para el acta cuando periodoTexto está vacío (RIPS sin registros) |
| `radPendingActa` | `{pFound, reg}` — dispara handleGenerarActa en el useEffect de registros |

### Flujo de descarga y procesamiento
1. Clic en chip de trimestre → `setRadPreview({c, reg, t, pFound})` — preview con metas y renuencias
2. Clic "Descargar RIPS y evaluar" → `doEvalDirect()` → descarga TXT de `radicacion.vercel.app/api/rips-ext` → `setRadFilesReady`
3. Botón "Procesar y Generar Acta" en radFilesReady → setea refs (`radForcedPrestId`, `radForcedReg`, `radForcedScale`, `radPeriodoOverride`, `radPendingActa`) → `processFiles` → useEffect dispara `handleGenerarActa`
4. Reintento automático: errores 5xx se reintentan 1 vez tras 2.5s; si falla, el mes se omite con aviso

### Endpoint radicación
- `GET https://radicacion.vercel.app/api/evaluar` — lista contratos y registros (header `x-token: DUSAKAWI-RIPS-2026`)
- `GET https://radicacion.vercel.app/api/rips-ext?contrato=X&anio=Y&mes=Z&regimen=RS&formato=txt` — descarga RIPS TXT

---

## Actas de Evaluación

- Guardadas en PocketBase (`app_storage` key `actas`) vía `CloudStorage.set`
- `ActaServicio.ejecutado` viene del conteo de `registros` filtrados por tipo
- El botón "Recalcular Servicios" actualiza los valores ejecutados con los RIPS cargados
- El aviso "NO se guardará automáticamente" solo aparece en pestaña **Formulario**
- **Guardar no cierra la ventana (v2.22).** `handleSaveActa` ya no hace `setShowActaModal(false)`. En `ActaModal`:
  - `savedJson` guarda el acta al momento de guardar; `guardada = savedJson === JSON.stringify(acta)`. El botón pasa a **"✓ Guardada"** (verde) y aparece la barra verde "Acta guardada" con **"Imprimir / PDF ahora"**. Si se edita después, la barra cambia a "Hay cambios sin guardar".
  - `impresa` se marca al ejecutar `window.print()`. Imprimir sin guardar sigue preguntando si se desea guardar primero.
  - Cerrar (X) pide confirmación si hay cambios sin guardar o si el acta está guardada pero no impresa.
  - `onSave` puede devolver `false` (p. ej. el usuario canceló el reemplazo de un acta duplicada en `handleSaveInlineActa`); en ese caso no se marca como guardada.

### Deduplicación de actas (`deduplicarActas`) — v2.15
Función en App.tsx (~línea 29). Corre en carga inicial, sync y poll. Tres pasos en cascada:
1. **Por `id` exacto** — misma instancia guardada dos veces → queda una.
2. **Por `prestadorId||numero`** — misma acta regenerada → queda la de mayor %.
3. **Por `contrato||regimen||periodoEvaluado`** — mismo contrato + régimen + período → queda la de mayor %. Elimina duplicados creados antes de v2.15.

### Validación al generar acta (`handleGenerarActa`) — v2.15
Si ya existe un acta para el mismo `contrato + regimen + periodoEvaluado`, muestra alerta:
> ⚠️ Ya se cuenta con una evaluación para: Contrato / Prestador / Período / Acta (N%)
> ¿Desea reemplazar?

Si el usuario cancela, no se genera la nueva. Si confirma, se elimina la existente.

---

## Tipos de contrato (`tipoContrato` en `types.ts`)

| Tipo | Constante en `logic.ts` | Tema | Descripción |
|---|---|---|---|
| `ASISTENCIAL` | `TIPOS_ASISTENCIAL` | Azul índigo | 11 servicios: consulta, odonto, enfermería, lab, imagen, gineco, medicina interna, TAB, urgencias, hosp, medicamentos |
| `ESPECIALIDADES` | `TIPOS_ESPECIALIDADES` | Morado | 6 servicios especializados |
| `CAPITA AMPLIADA` | `TIPOS_CAPITA_AMPLIADA` | Verde esmeralda | ASISTENCIAL + pediatría, nutrición, psicología |
| `PAI` | `TIPOS_PAI` | Naranja | 14 biológicos mapeados a CUPS 993xxx |

---

## Sincronización multi-dispositivo (v2.3+)

| Momento | Qué hace |
|---|---|
| **Carga inicial** | Fusiona localStorage + PocketBase. La nube tiene prioridad en conflicto de ID. |
| **Auto-save** (useEffect) | Cada vez que cambia estado clave, guarda en PocketBase si `cloudInitialized.current === true`. |
| **Poll 60 s** | Descarga cloud, fusiona con local. Si hay registros solo-locales, los sube. |
| **Sincronizar** | Botón manual: pull → merge → push fusionado. |
| **Ping 2 min** | `supabaseStatus` — verifica disponibilidad de PocketBase cada 2 minutos. Indicador verde/rojo/amarillo en header. |

### Dedup de prestadores
Clave secundaria: `${nit}|${contrato}` — evita duplicados por ID diferente.

### Dedup de actas
Ver sección **Deduplicación de actas** arriba.

---

## Lista de Prestadores — Cajones colapsables (v2.11+)
*Pestaña Prestadores (gestión completa)*

- Los prestadores están agrupados por NIT
- **Por defecto colapsados** — header muestra nombre, NIT, ubicación, badges S:/C: y total de actas
- **Clic en el header** → abre el cajón con:
  - Panel **SUBSIDIADO** (izquierda): mini tarjetas de actas verde/amarillo/rojo con % cumplimiento
  - Panel **CONTRIBUTIVO** (derecha): ídem
  - Clic en mini tarjeta → abre el acta
  - Contratos completos con botones (Cargar Metas, Acta, editar, eliminar)
- `expandedNits: Set<string>` — controla qué grupos están abiertos

---

## Dashboard — Panel Prestadores (v2.14+)
*Panel lateral derecho del Dashboard*

- Agrupa los contratos por NIT/IPS: una IPS con contratos subsidiado y contributivo aparece como una sola fila.
- **Clic en el header** despliega cajón con cada contrato coloreado (verde = SUBSIDIADO, naranja = CONTRIBUTIVO) y sus actas con barra de progreso y %.
- Botón **+ Acta** por contrato; botón **Ver** por acta navega al editor inline.
- Badges **S** y **C** en el header indican regímenes disponibles.
- Estado: `dashExpandedNits: Set<string>` — controla qué grupos están abiertos.
- Grupos precalculados ANTES del `return (<>` en el IIFE del tab dashboard (patrón crítico — no definir dentro del JSX).

---

## Renuencias (búsquedas fallidas) — v2.12+

- La sección "Renuencias y Búsquedas Fallidas" usa `chartData` como fuente de verdad: cualquier servicio que aparece en la gráfica aparece también en renuencias.
- Bug anterior (v2.11 y antes): filtraba por tipo de contrato del prestador y omitía PEDIATRÍA, PSICOLOGÍA, NUTRICIÓN cuando el tipo caía a `ASISTENCIAL`.
- El total de cada servicio suma `RIPS + renuencias ingresadas`.

---

## Renuncias — Trazabilidad completa (v2.13+)

- El campo **Responsable** es un `<select>` alimentado desde la lista de funcionarios registrados (antes era texto libre).
- Al abrir el formulario "Nueva Renuncia" se auto-rellena:
  - **Funcionario**: `currentUser.nombre` (usuario logueado)
  - **Prestador / Contrato / Régimen**: prestador detectado en RIPS (si existe)
  - **Período**: mes y año actual
- El campo Responsable es obligatorio — no se guarda sin identificar quién la registró.
- En PocketBase (`renuncias` key) queda trazabilidad: prestador, tipo de servicio, funcionario responsable.

---

## Formulario de Prestadores

### Nuevo prestador / + Contrato / Reset tras guardar
Siempre inicia con `tipoContrato: 'ASISTENCIAL'` y `TIPOS_ASISTENCIAL` en cero.

### Editar prestador existente
El formulario se popula desde `p.metas` del prestador seleccionado.

### Selector de prestador (Carga de Datos)
- Al seleccionar un prestador diferente al activo → RIPS se limpian automáticamente
- Detección desde archivos solo corre si `!detectedPrestadorId` (no sobreescribe selección manual)

---

## Modo Auditoría (v2.8+)

- `isAuditMode = !detectedPrestadorId && registros.length > 0`
- La gráfica muestra todos los tipos de servicio encontrados ordenados por cantidad, sin filtrar por metas
- Útil para explorar archivos desconocidos sin necesitar un prestador registrado

---

## Reglas críticas de React (lecciones de crashes anteriores)

1. **Nunca definir componentes React dentro de otra función de render.** React los trata como tipos nuevos en cada render → desmonta y remonta → estado perdido → crash.
2. **Todo estado referenciado en JSX debe estar definido.** Un revert que elimina estado pero deja el JSX que lo usa genera `Cannot read properties of undefined` al cargar.
3. **Todos los iconos lucide-react usados en JSX deben estar importados.** Un `<ChevronDown />` sin importar lanza `ReferenceError` en runtime que deja la página en blanco sin mensaje de error visible. Verificar siempre la línea de imports al agregar iconos nuevos.
4. **Precomputar grupos/datos ANTES del `return (<>` en IIFEs de tabs.** Calcular dentro del JSX (especialmente con `Map` o funciones complejas) puede causar errores de parsing del TSX o crashes silenciosos.
5. **No usar `Map<K,V>` como tipo anotado dentro de TSX.** Usar `Record<string, T>` o anotar fuera del JSX. El parser de TSX puede confundir los genéricos con tags JSX.

---

## Versiones

| Versión | Tag git | Descripción |
|---|---|---|
| **2.25** | `v2.25` | Metas del régimen correcto aunque el número de contrato del registro no coincida con radicación (contrato normalizado → NIT + régimen → otro régimen con aviso); selector para elegir el registro en el preview. |
| **2.24** | `v2.24` | El régimen complementario ya no copia las metas (inicia en cero); el preview indica el registro de origen de las metas y avisa si ambos regímenes tienen metas idénticas. |
| **2.23** | `v2.23` | Listos para evaluar: el prestador y sus metas se eligen por contrato + régimen (antes ambos regímenes usaban las mismas metas); aviso si falta el contrato del régimen. |
| **2.22** | `v2.22` | Guardar el acta no cierra la ventana: queda "✓ Guardada" y sugiere imprimir; cerrar pide confirmación si no se ha guardado o impreso. |
| **2.21** | `v2.21` | Duplicados con el mismo formato que vinculados de Urgencias en todos los servicios: "+N duplicados" y "Sumar (k/N)", selección por grupo, guardada en el acta y reversible (no borra registros). PAI agrupa vacunas. |
| **2.20** | `v2.20` | Duplicados revisables y quitables por servicio desde el acta (selección por grupo); renuencias del acta salen de los registros de la pestaña Renuencias, no de los números manuales del Dashboard. |
| **2.19** | `v2.19` | Líneas vinculadas a urgencias: selección individual por línea o todas; la selección se guarda en el acta. |
| **2.18** | `v2.18` | RIPS se cargan sin filtrar; duplicados (incl. urgencias/hosp) se revisan y quitan desde el acta; columna Renuencias editable; líneas de Otros Servicios vinculadas a urgencias con opción "Sumar"; fix fecha de ingreso en urgencias. |
| **2.17** | `v2.17` | Dedup inteligente con aviso de duplicados; modal de revisión para actas automáticas y manuales; fix toggle inUrgenciasSection; badge pendientes filtra solo contratos registrados. |
| **2.16** | `v2.16` | Módulo radicación: panel "Listos para evaluar" integrado en Dashboard. Solo muestra contratos registrados en la app. Fix régimen, scale y prestador forzados desde radicación. Reintento 5xx. Preview de metas y renuencias al clic. |
| **2.15** | `v2.15` | Deduplicación de actas por contrato+régimen+período. Alerta detallada al crear acta duplicada. |
| **2.14** | `v2.14` | Dashboard Prestadores agrupados por IPS/NIT con cajón de contratos y actas. |
| **2.13** | `v2.13` | Renuncias: Responsable desde lista de funcionarios, auto-relleno al abrir formulario. |
| **2.12** | `v2.12` | Renuencias usa chartData como fuente de verdad; total incluye renuencias + RIPS. |
| **2.11** | `v2.11` | Cajones colapsables en lista de prestadores con mini vista SUBSIDIADO/CONTRIBUTIVO. |
| **2.10** | `v2.10` | Migración de Supabase a PocketBase en VPS Contabo propio. |
| **2.9** | `v2.9` | Monitor de estado PocketBase con indicador verde/rojo en header, ping cada 2 min. |
| **2.8** | `v2.8` | Modo Auditoría: sin prestador seleccionado muestra todos los tipos de servicio. |
| **2.7** | `v2.7` | Selector de prestador limpia RIPS al cambiar. Detección no sobreescribe selección manual. |
| **2.6** | `v2.6` | RIPS se limpian al detectar prestador diferente en upload. |
| **2.5** | `v2.5` | Fix "Guardar Sesión": pull→merge→push (antes destruía datos de otros PCs). |
| **2.4** | `v2.4` | Fix "+Contrato" heredaba metas del prestador activo. |
| **2.3** | `v2.3` | Sync bidireccional de prestadores. Fix acta PAI. Fix poll pierde actas locales. |
| **2.2** | `v2.2` | Vista Previa dinámica desde RIPS. Migración auto actas PAI. Limpiar RIPS para todos. |
| **2.1** | `v2.1` | CAPITA AMPLIADA y PAI. Dashboard PAI unificado. Renuencias filtradas por tipo. |
| **2.0** | `v2.0` | Primera versión estable. MEDICAMENTOS corregido, impresión limpia, logo restaurado. |

```bash
# Volver a una versión
git checkout v2.15

# Crear tag nuevo
git tag v2.15 && git -c http.proxy="" -c https.proxy="" push \
  "https://<TOKEN>@github.com/chuvanegas/evaluacion-rips-2026.git" v2.15
```

---

## Rutas que abren el formulario de prestador

| Botón | Ubicación | Estado |
|---|---|---|
| "Nuevo Prestador" | Cabecera de la lista | ASISTENCIAL en 0 |
| Reset tras guardar | `handleSavePrestador` (~línea 770) | ASISTENCIAL en 0 |
| "+ Contrato" | Header del grupo NIT | ASISTENCIAL en 0 (corregido v2.4) |
| **Editar (lápiz)** | Fila de contrato | Carga datos existentes — correcto |
