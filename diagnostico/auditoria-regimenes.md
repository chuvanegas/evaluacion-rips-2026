# Auditoría de regímenes — prestadores y actas

Generado: 2026-11-12T21:36:23.284Z (solo lectura). Fuentes: PocketBase `app_storage` (`prestadores`, `actas`) y radicación `/api/evaluar` (generado 2026-11-12T15:20:52-05:00). Detalle completo en `auditoria-regimenes.json`.

## 1. Totales

| Dato | Valor |
|---|---|
| Registros de prestador | 134 (Subsidiado 70, Contributivo 64) |
| NIT distintos | 45 |
| Actas | 402 (reales 304, históricas HIST 98) |
| Actas sin régimen | 0 |
| Radicación: contratos / registros | 144 / 1553 |

## 2. Actas mal ubicadas: 218

| Caso | Actas |
|---|---|
| prestadorId inexistente → sin registro destino | 115 |
| prestadorId inexistente → se movería sola (registro destino único) | 59 |
| régimen distinto al del registro ligado → sin registro destino | 36 |
| régimen distinto al del registro ligado → se movería sola (registro destino único) | 7 |
| prestadorId inexistente → varios registros destino | 1 |

`reasignarActasPorRegimen` movería **66**; las otras **152** necesitan que primero exista el registro del régimen (ver sección 3).

### ALE SALUD SAS — NIT 901660868

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASE-44430-2026-60-3 | ASE-44430-2026-60 | CONTRIBUTIVO | Julio 2026, Agosto 2026, Septiembre 2026 | 74% | inexistente | — varios registros destino |
| ASE-44430-2026-60-3 | ASE-44430-2026-60 | SUBSIDIADO | Julio 2026, Agosto 2026, Septiembre 2026 | 59% | inexistente | — sin registro destino |
| HIST-20261026204144-1 | PMS-44430-2026-55 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | ASE-44430-2026-60 · CONTRIBUTIVO | — sin registro destino |
| HIST-20261026204733-3 | PMS-44430-2026-55 | SUBSIDIADO | Marzo 2026 | Histórico | ASE-44430-2026-60 · CONTRIBUTIVO | — sin registro destino |

### ANASHIWAYA IPSI — NIT 900177624

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASB-44001-2026-13-1 | ASB-44001-2026-13 | CONTRIBUTIVO | Marzo 2026 | 8% | inexistente | — sin registro destino |

### CLINICA ANESHI WAYAA IPS SAS — NIT 900653282

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| 44078-113-AS-1 | 44078-113-AS | SUBSIDIADO | Enero 2026, Febrero 2026 | 43% | inexistente | — sin registro destino |
| ASB-44078-2026-32-1 | ASB-44078-2026-32 | CONTRIBUTIVO | Marzo 2026 | 100% | inexistente | — sin registro destino |
| ASB-44078-2026-32-2 | ASB-44078-2026-32 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 65% | ASB-44078-2026-32 · SUBSIDIADO | — sin registro destino |
| ASB-44078-2026-32-1 | ASB-44078-2026-32 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 81% | inexistente | → ASB-44078-2026-32 · SUBSIDIADO |
| EB-44035-2026-03-1 | EB-44035-2026-03 | SUBSIDIADO | Marzo 2026 | 20% | inexistente | — sin registro destino |
| EB-44035-2026-03-2 | EB-44035-2026-03 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 23% | inexistente | — sin registro destino |
| EB-44078-2026-02-1 | EB-44078-2026-02 | SUBSIDIADO | Marzo 2026 | 69% | inexistente | — sin registro destino |
| EB-44078-2026-02-2 | EB-44078-2026-02 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 51% | inexistente | — sin registro destino |
| EB-44098-2026-04-1 | EB-44098-2026-04 | CONTRIBUTIVO | Marzo 2026 | 44% | inexistente | → EB-44098-2026-04 · CONTRIBUTIVO |
| EB-44279-2026-05-1 | EB-44279-2026-05 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 31% | inexistente | — sin registro destino |
| MDC-44078-2026-14-1 | MDC-44078-2026-14 | SUBSIDIADO | Marzo 2026 | 100% | inexistente | — sin registro destino |

### COMITÉ MUNICIPAL DE LA CRUZ ROJA DE MAICAO — NIT 800067514

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASE-44430-2026-40-1 | ASE-44430-2026-40 | CONTRIBUTIVO | Marzo 2026 | 73% | inexistente | → ASE-44430-2026-40 · CONTRIBUTIVO |
| ASE-44430-2026-40-2 | ASE-44430-2026-40 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 62% | inexistente | → ASE-44430-2026-40 · CONTRIBUTIVO |
| ASE-44430-2026-40-1 | ASE-44430-2026-40 | SUBSIDIADO | Marzo 2026 | 69% | inexistente | — sin registro destino |
| ASE-44430-2026-40-2 | ASE-44430-2026-40 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 68% | inexistente | — sin registro destino |
| ASE-44430-2026-40-3 | ASE-44430-2026-40 | SUBSIDIADO | Julio 2026, Agosto 2026, Septiembre 2026 | 76% | inexistente | — sin registro destino |

### DUSAKAWI IPS — NIT 824002362

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASB-20001-2026-36-2 | ASB-20001-2026-36 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 84% | inexistente | → ASB-20001-2026-36 · CONTRIBUTIVO |
| HIST-20261026204144-1 | ASB-20001-2026-36 | SUBSIDIADO | 1T 2026 | Histórico | ASB-20001-2026-36 · CONTRIBUTIVO | — sin registro destino |
| HIST-20261026204144-2 | ASB-20001-2026-36 | SUBSIDIADO | 2T 2026 | Histórico | ASB-20001-2026-36 · CONTRIBUTIVO | — sin registro destino |
| HIST-20261026204144-1 | ASB-20013-2026-33 | CONTRIBUTIVO | 1T 2026 | Histórico | ASB-20013-2026-33 · SUBSIDIADO | — sin registro destino |
| HIST-20261026204144-2 | ASB-20013-2026-33 | CONTRIBUTIVO | 2T 2026 | Histórico | ASB-20013-2026-33 · SUBSIDIADO | — sin registro destino |
| ASB-20013-2026-33-2 | ASB-20013-2026-33 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 86% | inexistente | → ASB-20013-2026-33 · SUBSIDIADO |
| ASB-20045-2026-26-1 | ASB-20045-2026-26 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 81% | inexistente | — sin registro destino |
| HIST-20261026204733-2 | ASB-20045-2026-26 | SUBSIDIADO | Marzo 2026 | Histórico | ASB-20045-2026-26 · CONTRIBUTIVO | — sin registro destino |
| ASB-20621-2026-17-1 | ASB-20621-2026-17 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 76% | inexistente | — sin registro destino |
| HIST-20261026204733-2 | ASB-20621-2026-17 | SUBSIDIADO | Marzo 2026 | Histórico | ASB-20621-2026-17 · CONTRIBUTIVO | — sin registro destino |
| ASE-44650-2026-62-1 | ASE-44650-2026-62 | SUBSIDIADO | Marzo 2026 | 53% | inexistente | — sin registro destino |
| ASE-44650-2026-62-2 | ASE-44650-2026-62 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 68% | inexistente | — sin registro destino |
| EB-20001-2026-06-1 | EB-20001-2026-06 | SUBSIDIADO | Marzo 2026 | 23% | inexistente | — sin registro destino |
| EB-20001-2026-06-2 | EB-20001-2026-06 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 19% | inexistente | — sin registro destino |
| HIST-20261026204733-2 | MD-RCV-20001-2026-58 | CONTRIBUTIVO | Abril, Mayo y Junio 2026 | Histórico | MD-RCV-20001-2026-58 · SUBSIDIADO | — sin registro destino |
| MD-RCV-20001-2026-58-1 | MD-RCV-20001-2026-58 | CONTRIBUTIVO | Marzo 2026 | 61% | inexistente | — sin registro destino |

### E S E HOSPITAL EDUARDO ARREDONDO DAZA — NIT 824000725

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASB-20001-2026-04-1 | ASB-20001-2026-04 | CONTRIBUTIVO | Marzo 2026 | 21% | inexistente | — sin registro destino |
| ASB-20001-2026-04-2 | ASB-20001-2026-04 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 5% | inexistente | — sin registro destino |
| ASB-20001-2026-04-5 | ASB-20001-2026-04 | CONTRIBUTIVO | Julio 2026, Agosto 2026, Septiembre 2026 | 3% | inexistente | — sin registro destino |
| ASB-20001-2026-04-1 | ASB-20001-2026-04 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 24% | inexistente | → ASB-20001-2026-04 · SUBSIDIADO |
| HIST-20261026204733-3 | ASB-20001-2026-04 | SUBSIDIADO | Marzo 2026 | Histórico | inexistente | → ASB-20001-2026-04 · SUBSIDIADO |

### E.S.E. HOSPITAL ARMANDO PABON LOPEZ — NIT 825000147

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASB-44560-2026-09-1 | ASB-44560-2026-09 | SUBSIDIADO | Marzo 2026 | 39% | inexistente | — sin registro destino |
| ASB-44560-2026-09-2 | ASB-44560-2026-09 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 36% | inexistente | — sin registro destino |
| HIST-20261026204144-1 | PAI-44560-2026-47 | SUBSIDIADO | Marzo 2026 | Histórico | 44560-084-AS · CONTRIBUTIVO | — sin registro destino |

### ESE ALEJANDRO PROSPERO REVEREND — NIT 819004070

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| 47001-138-AS-1 | 47001-138-AS | CONTRIBUTIVO | Enero 2026, Febrero 2026 | 25% | inexistente | — sin registro destino |
| ASE-47001-2026-37-1 | ASE-47001-2026-37 | CONTRIBUTIVO | Marzo 2026 | 47% | inexistente | — sin registro destino |
| ASE-47001-2026-37-3 | ASE-47001-2026-37 | CONTRIBUTIVO | Julio 2026, Agosto 2026, Septiembre 2026 | 9% | inexistente | — sin registro destino |
| HIST-20261026204144-2 | ASE-47001-2026-37 | CONTRIBUTIVO | Abril, Mayo y Junio 2026 | Histórico | inexistente | — sin registro destino |
| ASE-47001-2026-37-1 | ASE-47001-2026-37 | SUBSIDIADO | Marzo 2026 | 61% | inexistente | → ASE-47001-2026-37 · SUBSIDIADO |
| ASE-47001-2026-37-2 | ASE-47001-2026-37 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 40% | inexistente | → ASE-47001-2026-37 · SUBSIDIADO |
| HIST-20261026204144-1 | PMS-47001-2026-54 | SUBSIDIADO | 1T 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026204733-3 | PMS-47001-2026-54 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | inexistente | — sin registro destino |

### ESE HOSPITAL NUESTRA SEÑORA DEL CARMEN — NIT 825000620

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASB-44378-2026-29-1 | ASB-44378-2026-29 | SUBSIDIADO | Marzo 2026 | 40% | inexistente | → ASB-44378-2026-29-2 · SUBSIDIADO |
| ASB-44378-2026-29-2 | ASB-44378-2026-29 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026,  | 52% | inexistente | → ASB-44378-2026-29-2 · SUBSIDIADO |

### ESE HOSPITAL NUESTRA SEÑORA DEL PERPETUO SOCORRO — NIT 800061765

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| 44847-082-AS-1 | 44847-082-AS | CONTRIBUTIVO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 25% | inexistente | → 44847-082-AS · CONTRIBUTIVO |
| ASB-44847-2026-08-1 | ASB-44847-2026-08 | CONTRIBUTIVO | Marzo 2026 | 37% | inexistente | → ASB-44847-2026-08 · CONTRIBUTIVO |
| ASB-44847-2026-08-1 | ASB-44847-2026-08 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 47% | inexistente | — sin registro destino |
| ASB-44847-2026-35-1 | ASB-44847-2026-35 | CONTRIBUTIVO | Marzo 2026 | 16% | inexistente | — sin registro destino |
| ASB-44847-2026-35-2 | ASB-44847-2026-35 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 24% | inexistente | — sin registro destino |

### ESE HOSPITAL NUESTRA SEÑORA DEL PILAR — NIT 800101022

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASB-44078-2026-11-4-1 | ASB-44078-2026-11 | CONTRIBUTIVO | Marzo 2026 | 46% | inexistente | → ASB-44078-2026-11 · CONTRIBUTIVO |
| ASB-44078-2026-11-1 | ASB-44078-2026-11 | SUBSIDIADO | Marzo 2026 | 79% | inexistente | — sin registro destino |
| ASB-44078-2026-11-2 | ASB-44078-2026-11 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 82% | inexistente | — sin registro destino |

### ESE HOSPITAL SAN AGUSTIN DE FONSECA — NIT 892170002

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| HIST-20261026204144-1 | ASB-44279-2026-31 | SUBSIDIADO | Marzo 2026 | Histórico | ASB-44279-2026-31 · CONTRIBUTIVO | — sin registro destino |

### ESE HOSPITAL SAN RAFAEL DE ALBANIA — NIT 825002525

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASB-44035-2026-25-1 | ASB-44035-2026-25 | CONTRIBUTIVO | Marzo 2026 | 74% | inexistente | → ASB-44035-2026-25 · CONTRIBUTIVO |
| ASB-44035-2026-25-1 | ASB-44035-2026-25 | SUBSIDIADO | Marzo 2026 | 82% | inexistente | — sin registro destino |
| ASB-44035-2026-25-2 | ASB-44035-2026-25 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 49% | inexistente | — sin registro destino |

### ESE HOSPITAL SANTA TERESA DE JESUS DE AVILA — NIT 825001037

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| 44090-086-AS-1 | 44090-086-AS | CONTRIBUTIVO | Enero 2026, Febrero 2026 | 100% | inexistente | — sin registro destino |
| 44090-087-AS-2 | 44090-087-AS | CONTRIBUTIVO | Enero 2026, Febrero 2026 | 86% | inexistente | → 44090-087-AS · CONTRIBUTIVO |
| 44090-087-AS-1 | 44090-087-AS | SUBSIDIADO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 11% | inexistente | — sin registro destino |
| ASB-44090-2026-10-1 | ASB-44090-2026-10 | CONTRIBUTIVO | Marzo 2026 | 26% | inexistente | — sin registro destino |
| ASB-44090-2026-10-2 | ASB-44090-2026-10 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 34% | inexistente | — sin registro destino |
| ASB-44090-2026-10-4 | ASB-44090-2026-10 | CONTRIBUTIVO | Julio 2026, Agosto 2026, Septiembre 2026 | 1% | ASB-44090-2026-10 · SUBSIDIADO | — sin registro destino |
| ASB-44090-2026-20-1 | ASB-44090-2026-20 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 14% | inexistente | — sin registro destino |
| ASB-44090-2026-20-3 | ASB-44090-2026-20 | CONTRIBUTIVO | Julio 2026, Agosto 2026, Septiembre 2026 | 22% | inexistente | — sin registro destino |
| ASB-44090-2026-20-1 | ASB-44090-2026-20 | SUBSIDIADO | Marzo 2026 | 77% | inexistente | → ASB-44090-2026-20 · SUBSIDIADO |

### EZEQ - SALUD IPSI — NIT 900144134

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASE-44001-2026-51-1 | ASE-44001-2026-51 | CONTRIBUTIVO | Marzo 2026 | 69% | inexistente | → ASE-44001-2026-51 · CONTRIBUTIVO |
| ASE-44001-2026-51-1 | ASE-44001-2026-51 | SUBSIDIADO | Marzo 2026 | 75% | inexistente | — sin registro destino |
| ASE-44001-2026-51-2 | ASE-44001-2026-51 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 94% | inexistente | — sin registro destino |

### GONAWINDUA ETTE ENNAKA IPS INDIGENA — NIT 819003539

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| HIST-20261026204144-1 | ASB-44090-2026-34 | CONTRIBUTIVO | Marzo 2026 | Histórico | ASB-44090-2026-34 · SUBSIDIADO | — sin registro destino |
| ASB-44090-2026-34-1 | ASB-44090-2026-34 | SUBSIDIADO | Marzo 2026 | 21% | inexistente | → ASB-44090-2026-34 · SUBSIDIADO |
| HIST-20261026204144-1 | ASB-47001-2026-27 | SUBSIDIADO | Marzo 2026 | Histórico | ASB-47001-2026-27 · CONTRIBUTIVO | — sin registro destino |
| HIST-20261026204144-1 | ASB-47053-2026-22 | SUBSIDIADO | Marzo 2026 | Histórico | ASB-47053-2026-22 · CONTRIBUTIVO | — sin registro destino |
| HIST-20261026204144-1 | ASB-47189-2026-24 | SUBSIDIADO | Marzo 2026 | Histórico | ASB-47189-2026-24 · CONTRIBUTIVO | — sin registro destino |
| HIST-20261026204144-1 | ASB-47288-2026-19 | SUBSIDIADO | Marzo 2026 | Histórico | ASB-47288-2026-19 · CONTRIBUTIVO | — sin registro destino |

### GRUPO IMB IPS SAS — NIT 901182049

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| HIST-20261026204144-1 | DNT-44001-2026-01 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026204733-3 | DNT-44001-2026-01 | SUBSIDIADO | Marzo 2026 | Histórico | inexistente | — sin registro destino |

### HOSPITAL AGUSTIN CODAZZI — NIT 892300358

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| 20013-075-AS-1 | 20013-075-AS | CONTRIBUTIVO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 14% | inexistente | — sin registro destino |
| 20013-075-AS-2 | 20013-075-AS | CONTRIBUTIVO | Enero 2026, Febrero 2026 | 11% | inexistente | — sin registro destino |
| ASB-20013-2026-02-1 | ASB-20013-2026-02 | CONTRIBUTIVO | Marzo 2026 | 5% | inexistente | → ASB-20013-2026-02 · CONTRIBUTIVO |
| HIST-20261026204144-2 | ASB-20013-2026-02 | CONTRIBUTIVO | Abril, Mayo y Junio 2026 | Histórico | inexistente | → ASB-20013-2026-02 · CONTRIBUTIVO |
| ASB-20013-2026-02-1 | ASB-20013-2026-02 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 24% | inexistente | — sin registro destino |
| ASB-20013-2026-02-3 | ASB-20013-2026-02 | SUBSIDIADO | Julio 2026, Agosto 2026, Septiembre 2026 | 12% | inexistente | — sin registro destino |

### HOSPITAL CAMILO VILLAZON PUMAREJO — NIT 824002672

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| HIST-20261026204144-1 | ASB-20570-2026-03 | CONTRIBUTIVO | Abril, Mayo y Junio 2026 | Histórico | ASB-20570-2026-03 · SUBSIDIADO | — sin registro destino |
| HIST-20261026204733-3 | ASB-20570-2026-03 | CONTRIBUTIVO | Marzo 2026 | Histórico | ASB-20570-2026-03 · SUBSIDIADO | — sin registro destino |

### IPS FUNDACION SUMA — NIT 900222619

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| HIST-20261026204733-1 | DNT-44090-2026-07 | SUBSIDIADO | Marzo 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026204733-2 | DNT-44090-2026-07 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026204144-1 | DNT-47001-2026-06 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026204733-3 | DNT-47001-2026-06 | SUBSIDIADO | Marzo 2026 | Histórico | inexistente | — sin registro destino |

### IPS INDIGENA COTTUSHI SUSHI ANAIN WAKUA IPA IPS-I — NIT 900679383

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| HIST-20261026204144-1 | ASB-44560-2026-68 | CONTRIBUTIVO | Abril, Mayo y Junio 2026 | Histórico | ASB-44560-2026-68 · SUBSIDIADO | — sin registro destino |
| HIST-20261026204733-2 | ASB-44560-2026-68 | CONTRIBUTIVO | Marzo 2026 | Histórico | ASB-44560-2026-68 · SUBSIDIADO | — sin registro destino |

### IPS SALUD INTEGRAL H&B S.A.S. — NIT 900559160

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| HIST-20261026204144-2 | EB-44378-2026-01 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | EB-44378-2026-01 · CONTRIBUTIVO | — sin registro destino |

### IPSI AYUULEEPALA WAYUU — NIT 900210003

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASE-44430-2026-57-1 | ASE-44430-2026-57 | SUBSIDIADO | Marzo 2026 | 73% | inexistente | — sin registro destino |
| ASE-44430-2026-57-2 | ASE-44430-2026-57 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 77% | inexistente | — sin registro destino |
| ASE-44430-2026-57-4 | ASE-44430-2026-57 | SUBSIDIADO | Julio 2026, Agosto 2026, Septiembre 2026 | 66% | inexistente | — sin registro destino |

### IPSI CENTRO EPIDEMIOLOGICO Y DE SALUD INTEGRAL JEKEET AKUAITA — NIT 900517548

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASE-44001-2026-38-2 | ASE-44001-2026-38 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 65% | inexistente | → ASE-44001-2026-38 · CONTRIBUTIVO |
| ASE-44001-2026-38-1 | ASE-44001-2026-38 | SUBSIDIADO | Marzo 2026 | 87% | inexistente | → ASE-44001-2026-38 · SUBSIDIADO |
| HIST-20261026204144-2 | ASE-44001-2026-38 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | ASE-44001-2026-38 · CONTRIBUTIVO | → ASE-44001-2026-38 · SUBSIDIADO |
| ASE-44847-2026-47-1 | ASE-44847-2026-47 | CONTRIBUTIVO | Marzo 2026 | 59% | inexistente | → ASE-44847-2026-47 · CONTRIBUTIVO |
| ASE-44847-2026-47-2 | ASE-44847-2026-47 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 73% | inexistente | → ASE-44847-2026-47 · CONTRIBUTIVO |
| ASE-44847-2026-47-5 | ASE-44847-2026-47 | SUBSIDIADO | Julio 2026, Agosto 2026, Septiembre 2026 | 81% | inexistente | — sin registro destino |
| HIST-20261026204144-1 | ASE-44847-2026-47 | SUBSIDIADO | 1T 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026204144-2 | ASE-44847-2026-47 | SUBSIDIADO | 2T 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026205641-1 | PMS-44001-2026-52 | SUBSIDIADO | Marzo 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026205641-2 | PMS-44001-2026-52 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026204733-1 | PMS-44847-2026-53 | SUBSIDIADO | Marzo 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026204733-2 | PMS-44847-2026-53 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | inexistente | — sin registro destino |

### IPSI EITERRA JAWAPIA — NIT 900795851

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASE-44001-2026-49-1 | ASE-44001-2026-49 | CONTRIBUTIVO | Marzo 2026 | 69% | inexistente | — sin registro destino |
| ASE-44001-2026-49-2 | ASE-44001-2026-49 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 70% | inexistente | — sin registro destino |

### IPSI EREJEERIA WAYUU — NIT 839000936

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASE-44430-2026-64-1 | ASE-44430-2026-64 | CONTRIBUTIVO | Marzo 2026 | 74% | inexistente | — sin registro destino |
| ASE-44430-2026-64-2 | ASE-44430-2026-64 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 70% | inexistente | — sin registro destino |
| ASE-44430-2026-64-3 | ASE-44430-2026-64 | CONTRIBUTIVO | Julio 2026, Agosto 2026, Septiembre 2026 | 75% | inexistente | — sin registro destino |
| ASE-44430-2026-64-1 | ASE-44430-2026-64 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 70% | inexistente | → ASE-44430-2026-64 · SUBSIDIADO |

### IPSI KARAQUITA — NIT 900141404

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| HIST-20261026204144-1 | PMS-44430-2026-16 | SUBSIDIADO | 1T 2026 | Histórico | 44430-120-AS · CONTRIBUTIVO | — sin registro destino |
| HIST-20261026204144-2 | PMS-44430-2026-16 | SUBSIDIADO | 2T 2026 | Histórico | 44430-120-AS · CONTRIBUTIVO | — sin registro destino |

### IPSI KOTTUSHI SAO ANA — NIT 900794134

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| 44001-128-AS-1 | 44001-128-AS | CONTRIBUTIVO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 62% | inexistente | → 44001-128-AS · CONTRIBUTIVO |
| 44001-128-AS-1 | 44001-128-AS | SUBSIDIADO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 53% | inexistente | — sin registro destino |
| 44001-128-AS-2 | 44001-128-AS | SUBSIDIADO | Enero 2026, Febrero 2026 | 54% | inexistente | — sin registro destino |
| 44090-09EB-1 | 44090-09EB | CONTRIBUTIVO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 9% | inexistente | → 44090-09EB · CONTRIBUTIVO |
| 44090-09EB-1 | 44090-09EB | SUBSIDIADO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 4% | inexistente | — sin registro destino |
| 44090-09EB-2 | 44090-09EB | SUBSIDIADO | Enero 2026, Febrero 2026 | 2% | inexistente | — sin registro destino |
| 44560-07EB-1 | 44560-07EB | CONTRIBUTIVO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 9% | inexistente | → 44560-07EB · CONTRIBUTIVO |
| 44560-07EB-1 | 44560-07EB | SUBSIDIADO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 5% | inexistente | — sin registro destino |
| 44560-07EB-2 | 44560-07EB | SUBSIDIADO | Enero 2026, Febrero 2026 | 4% | inexistente | — sin registro destino |
| 44560-134-AS-2 | 44560-134-AS | CONTRIBUTIVO | Enero, Febrero, Marzo 2025 | 67% | inexistente | → 44560-134-AS · CONTRIBUTIVO |
| 44560-134-AS-4 | 44560-134-AS | CONTRIBUTIVO | Abril, Mayo, Junio 2025 | 60% | inexistente | → 44560-134-AS · CONTRIBUTIVO |
| 44560-134-AS-6 | 44560-134-AS | CONTRIBUTIVO | Jul, Agos, Sept 2025 | 64% | inexistente | → 44560-134-AS · CONTRIBUTIVO |
| 44560-134-AS-7 | 44560-134-AS | CONTRIBUTIVO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 35% | inexistente | → 44560-134-AS · CONTRIBUTIVO |
| 44560-134-AS-1 | 44560-134-AS | SUBSIDIADO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 52% | inexistente | — sin registro destino |
| 44560-134-AS-2 | 44560-134-AS | SUBSIDIADO | Enero 2026, Febrero 2026 | 53% | inexistente | — sin registro destino |
| 44847-08EB-1 | 44847-08EB | CONTRIBUTIVO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 2% | inexistente | → 44847-08EB · CONTRIBUTIVO |
| 44847-08EB-1 | 44847-08EB | SUBSIDIADO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 1% | inexistente | — sin registro destino |
| 44847-08EB-2 | 44847-08EB | SUBSIDIADO | Enero 2026, Febrero 2026 | 0% | inexistente | — sin registro destino |

### IPSI OUTTAJIAPULEE — NIT 900191322

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| 44847-131-AS-1 | 44847-131-AS | CONTRIBUTIVO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 98% | inexistente | → 44847-131-AS · CONTRIBUTIVO |
| 44847-131-AS-1 | 44847-131-AS | SUBSIDIADO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 99% | inexistente | — sin registro destino |
| 44847-131-AS-2 | 44847-131-AS | SUBSIDIADO | Enero 2026, Febrero 2026 | 98% | inexistente | — sin registro destino |
| ASE-44847-2026-56-1 | ASE-44847-2026-56 | CONTRIBUTIVO | Marzo 2026 | 87% | inexistente | → ASE-44847-2026-56 · CONTRIBUTIVO |
| HIST-20261026204144-1 | ASE-44847-2026-56 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | ASE-44847-2026-56 · CONTRIBUTIVO | — sin registro destino |
| HIST-20261026204733-3 | ASE-44847-2026-56 | SUBSIDIADO | Marzo 2026 | Histórico | ASE-44847-2026-56 · CONTRIBUTIVO | — sin registro destino |
| HIST-20261026204144-1 | PMS-44847-2026-34 | SUBSIDIADO | 1T 2026 | Histórico | 44847-131-AS · CONTRIBUTIVO | — sin registro destino |
| HIST-20261026204144-2 | PMS-44847-2026-34 | SUBSIDIADO | 2T 2026 | Histórico | 44847-131-AS · CONTRIBUTIVO | — sin registro destino |

### IPSI PALAIMA — NIT 900185729

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| 44847-117-AS-1 | 44847-117-AS | SUBSIDIADO | Octubre 2025, Noviembre 2025, Diciembre 2025, | 54% | inexistente | — sin registro destino |
| 44847-117-AS-2 | 44847-117-AS | SUBSIDIADO | Enero 2026, Febrero 2026 | 59% | inexistente | — sin registro destino |
| ASE-44847-2026-54-1 | ASE-44847-2026-54 | SUBSIDIADO | Marzo 2026 | 74% | inexistente | — sin registro destino |
| ASE-44847-2026-54-2 | ASE-44847-2026-54 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 43% | inexistente | — sin registro destino |
| HIST-20261026204144-1 | PMS-44847-2026-35 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | 44847-117-AS · CONTRIBUTIVO | — sin registro destino |
| HIST-20261026204733-3 | PMS-44847-2026-35 | SUBSIDIADO | Marzo 2026 | Histórico | 44847-117-AS · CONTRIBUTIVO | — sin registro destino |

### IPSI SUPULA WAYUU — NIT 825003149

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASE-44001-2026-58-2 | ASE-44001-2026-58 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 52% | inexistente | → ASE-44001-2026-58 · CONTRIBUTIVO |
| ASE-44001-2026-58-4 | ASE-44001-2026-58 | CONTRIBUTIVO | Julio 2026, Agosto 2026, Septiembre 2026 | 83% | inexistente | → ASE-44001-2026-58 · CONTRIBUTIVO |
| ASE-44001-2026-58-1 | ASE-44001-2026-58 | SUBSIDIADO | Marzo 2026 | 38% | inexistente | → ASE-44001-2026-58 · SUBSIDIADO |
| HIST-20261026204733-3 | ASE-44001-2026-58 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | ASE-44001-2026-58 · CONTRIBUTIVO | → ASE-44001-2026-58 · SUBSIDIADO |
| ASE-44430-2026-63-1 | ASE-44430-2026-63 | CONTRIBUTIVO | Marzo 2026 | 65% | inexistente | — sin registro destino |
| ASE-44430-2026-63-2 | ASE-44430-2026-63 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 69% | inexistente | — sin registro destino |
| ASE-44847-2026-66-1 | ASE-44847-2026-66 | SUBSIDIADO | Marzo 2026 | 84% | inexistente | → ASE-44847-2026-66 · SUBSIDIADO |

### IPSI WAYUU ANASHII — NIT 900144397

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASE-44430-2026-52-2 | ASE-44430-2026-52 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 65% | inexistente | → ASE-44430-2026-52 · CONTRIBUTIVO |
| ASE-44430-2026-52-5 | ASE-44430-2026-52 | CONTRIBUTIVO | Julio 2026, Agosto 2026, Septiembre 2026 | 88% | inexistente | → ASE-44430-2026-52 · CONTRIBUTIVO |
| HIST-20261026204144-1 | ASE-44430-2026-52 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | ASE-44430-2026-52 · CONTRIBUTIVO | → ASE-44430-2026-52 · SUBSIDIADO |
| HIST-20261026204733-3 | ASE-44430-2026-52 | SUBSIDIADO | Marzo 2026 | Histórico | ASE-44430-2026-52 · CONTRIBUTIVO | → ASE-44430-2026-52 · SUBSIDIADO |

### IPSI WAYUU TALATSHI — NIT 900486723

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASE-44430-2026-59-2 | ASE-44430-2026-59 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 76% | inexistente | → ASE-44430-2026-59 · CONTRIBUTIVO |
| ASE-44430-2026-59-3 | ASE-44430-2026-59 | CONTRIBUTIVO | Julio 2026, Agosto 2026, Septiembre 2026 | 10% | inexistente | → ASE-44430-2026-59 · CONTRIBUTIVO |
| ASE-44430-2026-59-1 | ASE-44430-2026-59 | SUBSIDIADO | Marzo 2026 | 76% | inexistente | → ASE-44430-2026-59 · SUBSIDIADO |
| HIST-20261026204144-1 | PMS-44430-2026-19 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026204733-3 | PMS-44430-2026-19 | SUBSIDIADO | Marzo 2026 | Histórico | inexistente | — sin registro destino |

### KANKUAMA IPSI — NIT 900060562

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASE-20001-2026-61-1 | ASE-20001-2026-61 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 56% | inexistente | — sin registro destino |
| ASE-20001-2026-61-4 | ASE-20001-2026-61 | CONTRIBUTIVO | Julio 2026, Agosto 2026, Septiembre 2026 | 62% | inexistente | — sin registro destino |
| HIST-20261026204733-5 | ASE-20001-2026-61 | CONTRIBUTIVO | Marzo 2026 | Histórico | inexistente | — sin registro destino |
| ASE-20001-2026-61-1 | ASE-20001-2026-61 | SUBSIDIADO | Marzo 2026 | 68% | inexistente | → ASE-20001-2026-61 · SUBSIDIADO |
| HIST-20261026204733-2 | ASE-20001-2026-61 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | inexistente | → ASE-20001-2026-61 · SUBSIDIADO |
| HIST-20261026204144-1 | MDC-20001-2026-06 | CONTRIBUTIVO | 1T 2026 | Histórico | inexistente | → MDC-20001-2026-06 · CONTRIBUTIVO |
| HIST-20261026204144-2 | MDC-20001-2026-06 | CONTRIBUTIVO | 2T 2026 | Histórico | inexistente | → MDC-20001-2026-06 · CONTRIBUTIVO |
| MDC-20001-2026-06-1 | MDC-20001-2026-06 | SUBSIDIADO | Marzo 2026 | 100% | inexistente | — sin registro destino |
| MDC-20001-2026-06-2 | MDC-20001-2026-06 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 100% | inexistente | — sin registro destino |
| MDC-20001-2026-06-3 | MDC-20001-2026-06 | SUBSIDIADO | Julio 2026, Agosto 2026, Septiembre 2026 | 100% | inexistente | — sin registro destino |

### MAKUSHAMA SALUD IPS SAS — NIT 901217389

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| 44001-121-AS-1 | 44001-121-AS | SUBSIDIADO | Octubre 2025, Noviembre 2025, Diciembre 2025 | 64% | inexistente | — sin registro destino |
| 44001-121-AS-2 | 44001-121-AS | SUBSIDIADO | Enero 2026, Febrero 2026 | 51% | inexistente | — sin registro destino |
| HIST-20261026204144-2 | ASE-44001-2026-44 | CONTRIBUTIVO | Abril, Mayo y Junio 2026 | Histórico | ASE-44001-2026-44 · SUBSIDIADO | → ASE-44001-2026-44 · CONTRIBUTIVO |
| ASE-44090-2026-42-1 | ASE-44090-2026-42 | CONTRIBUTIVO | Marzo 2026 | 11% | inexistente | → ASE-44090-2026-42 · CONTRIBUTIVO |
| HIST-20261026204144-3 | ASE-44090-2026-42 | CONTRIBUTIVO | 2T 2026 | Histórico | inexistente | → ASE-44090-2026-42 · CONTRIBUTIVO |
| ASE-44090-2026-42-1 | ASE-44090-2026-42 | SUBSIDIADO | Marzo 2026 | 21% | inexistente | — sin registro destino |
| ASE-44090-2026-42-2 | ASE-44090-2026-42 | SUBSIDIADO | Abril 2026, Mayo 2026, Junio 2026 | 37% | inexistente | — sin registro destino |
| ASE-44090-2026-42-4 | ASE-44090-2026-42 | SUBSIDIADO | Julio 2026, Agosto 2026, Septiembre 2026 | 63% | inexistente | — sin registro destino |

### MUNDO MEDIC IPS SAS — NIT 901534837

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASE-47660-2026-46-1 | ASE-47660-2026-46 | CONTRIBUTIVO | Marzo 2026 | 38% | inexistente | — sin registro destino |
| HIST-20261026204144-2 | ASE-47660-2026-46 | CONTRIBUTIVO | Abril, Mayo y Junio 2026 | Histórico | ASE-47660-2026-46 · SUBSIDIADO | — sin registro destino |
| ASE-47660-2026-46-1 | ASE-47660-2026-46 | SUBSIDIADO | Marzo 2026 | 43% | inexistente | → ASE-47660-2026-46 · SUBSIDIADO |

### SUMINFARMA SAS — NIT 901556821

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| HIST-20261026204144-1 | MDC-44001-2026-15 | CONTRIBUTIVO | 1T 2026 | Histórico | MDC-44001-2026-15 · SUBSIDIADO | — sin registro destino |
| HIST-20261026204144-2 | MDC-44001-2026-15 | CONTRIBUTIVO | 2T 2026 | Histórico | MDC-44001-2026-15 · SUBSIDIADO | — sin registro destino |
| HIST-20261026204144-1 | MDC-44847-2026-12 | CONTRIBUTIVO | Abril, Mayo y Junio 2026 | Histórico | MDC-44847-2026-12 · SUBSIDIADO | — sin registro destino |
| HIST-20261026204733-3 | MDC-44847-2026-12 | CONTRIBUTIVO | Marzo 2026 | Histórico | MDC-44847-2026-12 · SUBSIDIADO | — sin registro destino |

### UNIDAD MEDICA WAYUU ANOUTA WAKUAIPA IPSI — NIT 900016853

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| ASE-44001-2026-48-2 | ASE-44001-2026-48 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 54% | inexistente | → ASE-44001-2026-48 · CONTRIBUTIVO |
| ASE-44001-2026-48-1 | ASE-44001-2026-48 | SUBSIDIADO | Marzo 2026 | 34% | inexistente | → ASE-44001-2026-48 · SUBSIDIADO |
| HIST-20261026204144-2 | ASE-44001-2026-48 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | ASE-44001-2026-48 · CONTRIBUTIVO | → ASE-44001-2026-48 · SUBSIDIADO |
| ASE-44560-2026-53-2 | ASE-44560-2026-53 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 59% | inexistente | → ASE-44560-2026-53 · CONTRIBUTIVO |
| ASE-44560-2026-53-1 | ASE-44560-2026-53 | SUBSIDIADO | Marzo 2026 | 32% | inexistente | → ASE-44560-2026-53 · SUBSIDIADO |
| HIST-20261026204733-3 | ASE-44560-2026-53 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | ASE-44560-2026-53 · CONTRIBUTIVO | → ASE-44560-2026-53 · SUBSIDIADO |
| HIST-20261026205641-1 | PMS-44001-2026-29 | SUBSIDIADO | Marzo 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026205641-2 | PMS-44001-2026-29 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026204733-1 | PMS-44560-2026-22 | CONTRIBUTIVO | Marzo 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026204733-2 | PMS-44560-2026-22 | CONTRIBUTIVO | Abril, Mayo y Junio 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026204144-1 | PMS-44560-2026-22 | SUBSIDIADO | 1T 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026204144-2 | PMS-44560-2026-22 | SUBSIDIADO | 2T 2026 | Histórico | inexistente | — sin registro destino |

### WALE KERU IPSI — NIT 900589110

| Acta | Contrato | Régimen acta | Período | % | Registro ligado | Destino |
|---|---|---|---|---|---|---|
| 44001-133-AS-1 | 44001-133-AS | CONTRIBUTIVO | Enero 2026, Febrero 2026 | 46% | inexistente | — sin registro destino |
| ASE-44001-2026-39-1 | ASE-44001-2026-39 | CONTRIBUTIVO | Marzo 2026 | 72% | inexistente | — sin registro destino |
| ASE-44001-2026-39-2 | ASE-44001-2026-39 | CONTRIBUTIVO | Abril 2026, Mayo 2026, Junio 2026 | 69% | inexistente | — sin registro destino |
| ASE-44001-2026-39-4 | ASE-44001-2026-39 | CONTRIBUTIVO | Julio 2026, Agosto 2026, Septiembre 2026 | 65% | inexistente | — sin registro destino |
| HIST-20261026204144-1 | ASE-44001-2026-39 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | inexistente | → ASE-44001-2026-39 · SUBSIDIADO |
| HIST-20261026204733-3 | ASE-44001-2026-39 | SUBSIDIADO | Marzo 2026 | Histórico | inexistente | → ASE-44001-2026-39 · SUBSIDIADO |
| HIST-20261026204733-1 | PMS-44001-2026-30 | SUBSIDIADO | Marzo 2026 | Histórico | inexistente | — sin registro destino |
| HIST-20261026204733-2 | PMS-44001-2026-30 | SUBSIDIADO | Abril, Mayo y Junio 2026 | Histórico | inexistente | — sin registro destino |

## 3. Registros faltantes: 164

Pares contrato + régimen con actas y/o radicaciones con datos, sin registro en la app (solo NIT que sí tienen algún registro). **54** son el régimen que falta de un contrato que sí tiene el otro (lo esperable del bug ≤ v2.29); **110** son contratos sin ningún registro (a menudo PAI, RCV, DNT, PMS, MDC, EB… que quizá no se evalúan aquí). 84 tienen actas.

Meses = **mes de factura** (`periodo_mes`; atención = mes anterior).

### ALE SALUD SAS — NIT 901660868

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASE-44430-2026-60 | SUBSIDIADO | falta este régimen (el otro sí existe) | 3 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44430-2026-55 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44430-2026-55 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |

### ANASHIWAYA IPSI — NIT 900177624

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASB-44001-2026-13 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 1 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PAI-44001-2026-46 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PAI-44001-2026-46 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |

### CLINICA ANESHI WAYAA IPS SAS — NIT 900653282

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| 44078-113-AS | SUBSIDIADO | contrato sin ningún registro en la app | 1 | — |
| ASB-44078-2026-32 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |
| EB-44035-2026-03 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| EB-44078-2026-02 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| EB-44279-2026-05 | SUBSIDIADO | falta este régimen (el otro sí existe) | 1 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| MDC-44078-2026-14 | SUBSIDIADO | falta este régimen (el otro sí existe) | 1 | Abr 26 |
| RCV-44078-2026-10 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| RCV-44078-2026-10 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |

### COMITÉ MUNICIPAL DE LA CRUZ ROJA DE MAICAO — NIT 800067514

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASE-44430-2026-40 | SUBSIDIADO | falta este régimen (el otro sí existe) | 3 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44430-2026-14 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-44430-2026-14 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |

### DUSAKAWI IPS — NIT 824002362

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASB-20001-2026-36 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| ASB-20013-2026-33 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| ASB-20045-2026-26 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| ASB-20621-2026-17 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| ASE-44650-2026-62 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| DNT-20001-2026-02 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| DNT-20001-2026-02 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| DNT-44650-2026-03 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| DNT-44650-2026-03 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| EB-20001-2026-06 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| MD-RCV-20001-2026-58 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-20001-2026-7 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-20001-2026-7 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-20013-2026-4 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-20013-2026-4 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-20045-2026-2 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-20045-2026-2 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-20621-2026-1 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-20621-2026-1 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-44650-2026-31 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-44650-2026-31 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |

### E S E HOSPITAL EDUARDO ARREDONDO DAZA — NIT 824000725

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASB-20001-2026-04 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 3 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |

### E.S.E. HOSPITAL ARMANDO PABON LOPEZ — NIT 825000147

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASB-44560-2026-09 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| ASB-44560-2026-28 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| ASB-44560-2026-28 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PAI-44560-2026-47 | SUBSIDIADO | contrato sin ningún registro en la app | 1 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |
| PMS-44560-2026-20 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-44560-2026-20 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26 |

### ESE ALEJANDRO PROSPERO REVEREND — NIT 819004070

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| 47001-138-AS | CONTRIBUTIVO | contrato sin ningún registro en la app | 1 | — |
| ASE-47001-2026-37 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 3 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-47001-2026-54 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-47001-2026-54 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |

### ESE HOSPITAL DE NAZARETH — NIT 892115347

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASB-44847-2026-30 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | — |

### ESE HOSPITAL NUESTRA SEÑORA DEL CARMEN — NIT 825000620

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASB-44378-2026-29 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44378-2026-40 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44378-2026-40 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |

### ESE HOSPITAL NUESTRA SEÑORA DEL PERPETUO SOCORRO — NIT 800061765

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASB-44847-2026-08 | SUBSIDIADO | falta este régimen (el otro sí existe) | 1 | Abr 26, May 26, Jun 26, Jul 26 |
| ASB-44847-2026-35 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26 |
| PMS-44847-2026-33 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |
| PMS-44847-2026-33 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26 |

### ESE HOSPITAL NUESTRA SEÑORA DEL PILAR — NIT 800101022

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASB-44078-2026-11 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-44078-2026-48 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-44078-2026-48 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, Jun 26, Jul 26, Ago 26, Sep 26 |

### ESE HOSPITAL SAN AGUSTIN DE FONSECA — NIT 892170002

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASB-44279-2026-31 | SUBSIDIADO | falta este régimen (el otro sí existe) | 1 | Abr 26, May 26 |
| PMS-44279-2026-39 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26 |

### ESE HOSPITAL SAN RAFAEL DE ALBANIA — NIT 825002525

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASB-44035-2026-25 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-44035-2026-37 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Mar 26, Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-44035-2026-37 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |

### ESE HOSPITAL SANTA RITA DE CASSIA — NIT 825000834

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| PMS-44098-2026-38 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26 |

### ESE HOSPITAL SANTA TERESA DE JESUS DE AVILA — NIT 825001037

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| 44090-086-AS | CONTRIBUTIVO | contrato sin ningún registro en la app | 1 | — |
| 44090-087-AS | SUBSIDIADO | contrato sin ningún registro en la app | 1 | — |
| ASB-44090-2026-10 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 3 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| ASB-44090-2026-20 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44090-2026-12 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44090-2026-12 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26 |

### EZEQ - SALUD IPSI — NIT 900144134

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASE-44001-2026-51 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26 |
| PMS-44001-2026-23 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26 |
| PMS-44001-2026-23 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26 |

### GONAWINDUA ETTE ENNAKA IPS INDIGENA — NIT 819003539

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASB-44090-2026-34 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 1 | Abr 26, May 26 |
| ASB-47001-2026-27 | SUBSIDIADO | falta este régimen (el otro sí existe) | 1 | Abr 26, May 26 |
| ASB-47053-2026-22 | SUBSIDIADO | falta este régimen (el otro sí existe) | 1 | Abr 26 |
| ASB-47189-2026-24 | SUBSIDIADO | falta este régimen (el otro sí existe) | 1 | Abr 26 |
| ASB-47288-2026-19 | SUBSIDIADO | falta este régimen (el otro sí existe) | 1 | Abr 26 |

### HOSPITAL AGUSTIN CODAZZI — NIT 892300358

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| 20013-075-AS | CONTRIBUTIVO | contrato sin ningún registro en la app | 2 | — |
| ASB-20013-2026-02 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |

### HOSPITAL CAMILO VILLAZON PUMAREJO — NIT 824002672

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASB-20570-2026-03 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 2 | — |

### I.P.S.I ANASHANTA SUPUSHUAYA — NIT 900209093

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| PMS-44001-2026-24 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |

### I.P.S.I. WALEKERU — NIT 900589110

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| 44001-133-AS | CONTRIBUTIVO | contrato sin ningún registro en la app | 1 | — |

### IPS INDIGENA COTTUSHI SUSHI ANAIN WAKUA IPA IPS-I — NIT 900679383

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASB-44560-2026-68 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 2 | — |
| PMS-44560-2026-59 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Jul 26, Ago 26, Sep 26 |

### IPS SALUD INTEGRAL H&B S.A.S. — NIT 900559160

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| EB-44378-2026-01 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |

### IPSI AYUULEEPALA WAYUU — NIT 900210003

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASE-44430-2026-57 | SUBSIDIADO | falta este régimen (el otro sí existe) | 3 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44430-2026-13 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44430-2026-13 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |

### IPSI CENTRO EPIDEMIOLOGICO Y DE SALUD INTEGRAL JEKEET AKUAITA — NIT 900517548

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASE-44847-2026-47 | SUBSIDIADO | falta este régimen (el otro sí existe) | 3 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44001-2026-52 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44001-2026-52 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44847-2026-53 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44847-2026-53 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |

### IPSI EITERRA JAWAPIA — NIT 900795851

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASE-44001-2026-49 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-44001-2026-25 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-44001-2026-25 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |

### IPSI EREJEERIA WAYUU — NIT 839000936

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASE-44430-2026-64 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 3 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44430-2026-15 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44430-2026-15 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |

### IPSI INDIGENA KOTTUSHI SAO ANA — NIT 900794134

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| CMP-44090-2026-51 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26 |
| PMS-44001-2026-26 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-44560-2026-21 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |

### IPSI KARAQUITA — NIT 900141404

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| PMS-44430-2026-16 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44430-2026-16 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26 |

### IPSI KOTTUSHI SAO ANA — NIT 900794134

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| 44001-128-AS | SUBSIDIADO | contrato sin ningún registro en la app | 2 | — |
| 44090-09EB | SUBSIDIADO | contrato sin ningún registro en la app | 2 | — |
| 44560-07EB | SUBSIDIADO | contrato sin ningún registro en la app | 2 | — |
| 44560-134-AS | SUBSIDIADO | contrato sin ningún registro en la app | 2 | — |
| 44847-08EB | SUBSIDIADO | contrato sin ningún registro en la app | 2 | — |

### IPSI OUTTAJIAPULEE — NIT 900191322

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| 44847-131-AS | SUBSIDIADO | contrato sin ningún registro en la app | 2 | — |
| ASE-44847-2026-56 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-44847-2026-34 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |
| PMS-44847-2026-34 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |

### IPSI PALAIMA — NIT 900185729

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| 44847-117-AS | SUBSIDIADO | contrato sin ningún registro en la app | 2 | — |
| ASE-44847-2026-54 | SUBSIDIADO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |
| PMS-44847-2026-35 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |
| PMS-44847-2026-35 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |

### IPSI SUPULA WAYUU — NIT 825003149

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASE-44430-2026-63 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44001-2026-27 | SUBSIDIADO | contrato sin ningún registro en la app | 1 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44001-2026-27 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44430-2026-17 | SUBSIDIADO | contrato sin ningún registro en la app | 1 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44430-2026-17 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44847-2026-36 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44847-2026-36 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |

### IPSI WAYUU ANASHII — NIT 900144397

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| PMS-44430-2026-18 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44430-2026-18 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |

### IPSI WAYUU TALATSHI — NIT 900486723

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| PMS-44430-2026-19 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44430-2026-19 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |

### KANKUAMA IPSI — NIT 900060562

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASE-20001-2026-50 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 0 | May 26 |
| ASE-20001-2026-61 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 3 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| DNT-20001-2026-05 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |
| MDC-20001-2026-06 | SUBSIDIADO | falta este régimen (el otro sí existe) | 3 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-20001-2026-50 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |
| PMS-20001-2026-8 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |
| PMS-20001-2026-8 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |

### MAKUSHAMA SALUD IPS SAS — NIT 901217389

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| 44001-121-AS | SUBSIDIADO | contrato sin ningún registro en la app | 2 | — |
| ASE-44090-2026-42 | SUBSIDIADO | falta este régimen (el otro sí existe) | 3 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44001-2026-28 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44001-2026-28 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44090-2026-11 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44090-2026-11 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |

### MUNDO MEDIC IPS SAS — NIT 901534837

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASE-47660-2026-46 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |
| PMS-47660-2026-56 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26 |

### SUMINFARMA SAS — NIT 901556821

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| MDC-44001-2026-15 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| MDC-44847-2026-12 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |

### UNIDAD MEDICA WAYUU ANOUTA WAKUAIPA IPSI — NIT 900016853

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| PMS-44001-2026-29 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44001-2026-29 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44560-2026-22 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44560-2026-22 | CONTRIBUTIVO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |

### WALE KERU IPSI — NIT 900589110

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASE-44001-2026-39 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 3 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44001-2026-30 | SUBSIDIADO | contrato sin ningún registro en la app | 2 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-44001-2026-30 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |

### WINTUKWA IPSI — NIT 900073645

| Contrato | Régimen faltante | Tipo | Actas | Facturas radicadas con datos |
|---|---|---|---|---|
| ASE-20001-2026-65 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 0 | Abr 26, May 26 |
| ASE-20570-2026-67 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 0 | Abr 26, May 26 |
| DNT-20001-2026-04 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| DNT-20001-2026-04 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26 |
| MDC-20001-2026-07 | CONTRIBUTIVO | falta este régimen (el otro sí existe) | 0 | Abr 26, May 26 |
| PMS-20001-2026-9 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26, Oct 26 |
| PMS-20001-2026-9 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26 |
| PMS-20570-2026-6 | SUBSIDIADO | contrato sin ningún registro en la app | 0 | Abr 26, May 26, Jun 26, Jul 26, Ago 26, Sep 26 |
| PMS-20570-2026-6 | CONTRIBUTIVO | contrato sin ningún registro en la app | 0 | Abr 26, May 26 |

## 4. Registros duplicados en la app: 6

Mismo NIT + contrato normalizado + régimen.

| Prestador | Contrato | Régimen | Registros (id → actas ligadas) |
|---|---|---|---|
| CLINICA ANESHI WAYAA I.P.S. S.A.S | EB-44078-2026-02 | CONTRIBUTIVO | 1781624607737 → 2; 1790260826464 → 0 |
| CLINICA ANESHI WAYAA I.P.S. S.A.S | EB-44035-2026-03 | CONTRIBUTIVO | 1781627398465 → 1; 1790259968616 → 1 |
| IPSI PALAIMA | ASE-44847-2026-54 | CONTRIBUTIVO | 1781645058433 → 2; 1786719176989 → 0 |
| IPSI AYUULEEPALA WAYUU | ASE-44430-2026-57 | CONTRIBUTIVO | 1781629796463 → 2; 1793284274853 → 1 |
| IPS SALUD INTEGRAL H&B S.A.S. | EB-44378-2026-01 | CONTRIBUTIVO | 1781620816518 → 2; 1786736429361 → 1 |
| ALE SALUD SAS | ASE-44430-2026-60 | CONTRIBUTIVO | 1781622558382 → 1; 1786481966351 → 3 |

### Metas idénticas Subsidiado/Contributivo del mismo contrato: 0

Ningún par con las mismas metas activas.
