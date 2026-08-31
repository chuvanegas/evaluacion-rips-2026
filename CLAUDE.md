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

---

## Arquitectura

```
App.tsx                  ← componente raíz, lógica principal (~3000 líneas)
index.tsx                ← punto de entrada React
index.html               ← HTML con print CSS y portal de impresión
types.ts                 ← interfaces TypeScript (RipsRecord, Acta, Prestador, etc.)
components/
  ActaModal.tsx          ← formulario + Vista Previa + impresión de actas
  ReportesTab.tsx        ← tab de reportes y ranking CUPS/pacientes
utils/
  logic.ts               ← lógica de cálculo de metas y cumplimiento
services/
  storageService.ts      ← persistencia Supabase (actas, prestadores, renuencias)
  supabaseClient.ts      ← cliente Supabase
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
- `actas: Acta[]` — actas guardadas en Supabase

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
Los nombres de medicamento se truncan a **30 caracteres**. Algunos terminan en `M` o `F` suelto (ej: `"CLOPIDROGEL 75 mg (PLATEMAX) M"`), lo que disparaba falsamente el detector automático de sección USUARIOS (regex `\b[MFmf]\b` + fecha), rompiendo el conteo de todos los medicamentos siguientes en esa sección.

**Fix:** La auto-detección de USUARIOS no corre cuando `section === "MEDICAMENTOS"`.

### Deduplicación de medicamentos
Clave de dedup: `${paciente}|${codMed}|${fecha}` — una dispensación única por paciente+código+fecha. Compartida en `medDupSet` entre todos los archivos de un mismo upload, y también entre uploads sucesivos (acumulación en `setRegistros`).

### Exclusión de OXÍGENO
Se excluyen líneas donde `nombreMed` coincide con `/OXIGENO|OXIGEN|GAS\s+MED|OXYGEN/i`.

### Detección de secciones (App.tsx ~línea 1255)
```
"ARCHIVO-MEDICAMENTOS" → section = "MEDICAMENTOS"
"ARCHIVO-OTROS SERVICIOS" → section = "SERVICIOS"
"ARCHIVO-USUARIOS" → section = "USUARIOS"
"ARCHIVO-URGENCIAS" → inUrgenciasSection = true
```
La auto-detección de USUARIOS (por heurística fecha+sexo) solo corre si `section !== "USUARIOS" && section !== "MEDICAMENTOS"`.

---

## Impresión / PDF de actas

- Botón "Imprimir / PDF" copia el HTML del acta a `#acta-print-portal` (div hermano de `#root` en el body)
- CSS en `index.html`:
  ```css
  @media print {
    #root { display: none !important; }
    #acta-print-portal { display: block !important; }
  }
  ```
- Esto oculta toda la UI de la app y muestra solo el contenido del acta
- El logo `logo-dusakawi.jpg` debe estar en `public/` para aparecer en el acta

---

## Actas de Evaluación

- Guardadas en Supabase (tabla `actas`)
- `ActaServicio.ejecutado` viene del conteo de `registros` filtrados por tipo
- El botón "Recalcular Servicios" actualiza los valores ejecutados con los RIPS cargados actualmente
- El aviso "NO se guardará automáticamente" solo aparece en pestaña **Formulario**, no en **Vista Previa**

---

## Tipos de contrato (`tipoContrato` en `types.ts`)

| Tipo | Constante en `logic.ts` | Tema | Descripción |
|---|---|---|---|
| `ASISTENCIAL` | `TIPOS_ASISTENCIAL` | Azul índigo | 11 servicios: consulta, odonto, enfermería, lab, imagen, gineco, medicina interna, TAB, urgencias, hosp, medicamentos |
| `ESPECIALIDADES` | `TIPOS_ESPECIALIDADES` | Morado | 6 servicios especializados |
| `CAPITA AMPLIADA` | `TIPOS_CAPITA_AMPLIADA` | Verde esmeralda | ASISTENCIAL + pediatría, nutrición, psicología |
| `PAI` | `TIPOS_PAI` | Naranja | 14 biológicos mapeados a CUPS 993xxx. Dashboard agrega todo en una barra "PAI". Renuencias muestra por vacuna. |

### PAI — Archivos RIPS
Los archivos `ARCHIVO-PROCEDIMIENTOS` (tipo AP) se procesan como `section = "SERVICIOS"` en el parser. Los CUPS 993xxx están en `CUPS_MAP_RAW` y clasifican automáticamente al tipo de biológico correcto. El `useMemo` expone `typeCount` (conteo bruto por tipo) para que la sección Renuencias pueda leer conteos individuales aunque el chart esté agrupado.

---

## Sincronización multi-dispositivo (v2.3+)

Todo dato persistente (prestadores, actas, renuencias, usuarios, firmantes, CUPS personalizados) se guarda en **Supabase** y se sincroniza automáticamente.

### Estrategia de sync

| Momento | Qué hace |
|---|---|
| **Carga inicial** | Fusiona localStorage + Supabase. La nube tiene prioridad en conflicto de ID pero los registros solo-locales también se conservan y se suben. |
| **Auto-save** (useEffect) | Cada vez que cambia `prestadores`, `actas`, `renuncias`, etc., se guarda en Supabase si `cloudInitialized.current === true`. |
| **Poll 60 s** | Descarga cloud, fusiona con local. Si hay registros solo-locales que la nube no conoce, devuelve nuevo array → dispara auto-save → los sube. |
| **Guardar Sesión** | Botón manual de push+pull completo. Útil para sincronizar inmediatamente sin esperar el poll. |

### Dedup de prestadores
Clave de dedup secundaria: `${nit}|${contrato}` — si el mismo prestador fue creado con distintos IDs en dos PCs, se conserva solo uno.

### Dedup de actas (`deduplicarActas`)
1. Por `id` exacto (mismo objeto guardado dos veces → una copia).
2. Por `prestadorId||numero` — si el acta fue regenerada (nuevo ID, mismo número y prestador), queda la de mayor % de cumplimiento.

---

## Formulario de Prestadores

### Nuevo prestador
- Siempre inicia con `tipoContrato: 'ASISTENCIAL'` y `TIPOS_ASISTENCIAL` en cero.
- No hereda las metas del prestador activo (bug corregido en v2.3).

### Editar prestador existente
- El formulario se popula desde `p.metas` del prestador seleccionado.
- Al cambiar el `tipoContrato` en el selector, las metas se recalculan automáticamente desde `TIPOS_*` correspondiente, conservando los valores guardados si el tipo de servicio existe en la nueva lista.

---

## Versiones

| Versión | Tag git | Descripción |
|---|---|---|
| **2.4** | `v2.4` | Fix botón "+Contrato" heredaba metas del prestador activo. Las tres rutas de apertura del formulario ahora inician siempre en ASISTENCIAL limpio. |
| **2.3** | `v2.3` | Sync bidireccional de prestadores. Fix acta ASISTENCIAL generada como PAI. Fix poll pierde actas solo-locales. |
| **2.2** | `v2.2` | Vista Previa del Acta con ejecutado dinámico desde RIPS. Migración auto de actas PAI viejas. Botón "Limpiar RIPS" para todos. |
| **2.1** | `v2.1` | CAPITA AMPLIADA y PAI como tipos de contrato. Dashboard PAI unificado. Renuencias filtradas por tipo de contrato. |
| **2.0** | `v2.0` | Primera versión estable documentada. MEDICAMENTOS corregido, impresión de actas limpia, logo restaurado, acumulación de uploads. |

Para volver a una versión: `git checkout v2.4`
Para crear una versión nueva: `git tag v2.4 && git push origin v2.4`

---

## Rutas que abren el formulario de prestador

Hay tres botones que abren `showPrestForm = true`. Los tres deben iniciar con metas limpias cuando crean un prestador/contrato nuevo:

| Botón | Ubicación | Estado |
|---|---|---|
| "Nuevo Prestador" | Cabecera de la lista de prestadores | Inicia con ASISTENCIAL en 0 |
| Reset tras guardar | `handleSavePrestador` (App.tsx ~línea 755) | Inicia con ASISTENCIAL en 0 |
| "+ Contrato" | Fila de representante en lista | Inicia con ASISTENCIAL en 0 (corregido v2.4) |

El botón **Editar (lápiz)** sí carga los datos del prestador existente — eso es correcto.
