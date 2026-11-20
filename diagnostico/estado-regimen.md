# Estado de regímenes — revisión de solo lectura (20/11/2026)

Datos de PocketBase (`app_storage`), solo GET. Detalle en `estado-regimen.json`.

| | 12/11/2026 | 20/11/2026 |
|---|---|---|
| Registros de prestador | 134 | **146** |
| SUBSIDIADO | 70 | **77** |
| CONTRIBUTIVO | 64 | **69** |
| Actas (reales / históricas) | 402 (304 / 98) | **421 (323 / 98)** |

- **No bajó** el número de registros SUBSIDIADO (+7); no hay señales de nuevos borrados por régimen.
- `updated` de `prestadores` y `actas`: 2026-11-20 13:20 UTC (la app sigue guardando; hay al menos una pestaña activa).
- **NIT 825002525 (San Rafael de Albania):** 4 registros — `ASB-44035-2026-25` S (8 metas > 0) y C (7), y `44035-090-AS` S (8) y C (8). Las 4 actas de ASB-44035-2026-25 (1T y 2T por régimen) apuntan a un registro existente de su mismo régimen; 3 fueron reasignadas (`prestadorIdAnterior`).
- **Pares contrato + régimen con actas reales sin registro:** 42 (77 actas).
- **Respaldos de PocketBase (`/api/backups`):** la API responde, pero la lista está **vacía** (no hay respaldos).
