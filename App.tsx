import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { read, utils, writeFile } from 'xlsx';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine 
} from 'recharts';
import { 
  Upload, FileText, Database, Trash2, Save, Download, 
  Activity, Users, TrendingUp, AlertTriangle, CheckCircle, Server,
  BarChart3, UserCheck, FileJson
} from 'lucide-react';
import { 
  normalizeId, parseDateFromLine, TIPOS_SERVICIOS_DEFAULT, 
  edadDetallada, grupoEtarioDesdeFN 
} from './utils/logic';
import { 
  ServiceTypeMeta, RipsRecord, UserRecord, MaestroCupItem, 
  ProcessingStats, ChartDataPoint, RankingCupsItem, RankingPatientItem 
} from './types';
import { StorageService } from './services/storageService';

function App() {
  // --- State ---
  const [scale, setScale] = useState<number>(1);
  const [metas, setMetas] = useState<ServiceTypeMeta[]>(
    TIPOS_SERVICIOS_DEFAULT.map(t => ({ type: t, monthlyGoal: 0, active: true }))
  );
  
  const [registros, setRegistros] = useState<RipsRecord[]>([]);
  const [usuariosMap, setUsuariosMap] = useState<Map<string, UserRecord>>(new Map());
  const [maestro, setMaestro] = useState<Map<string, MaestroCupItem>>(new Map());
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);

  // --- Persistence ---
  useEffect(() => {
    const initData = async () => {
      try {
        // Load Config
        const config = await StorageService.getConfig();
        if (config) {
          if (config.metas && config.metas.length > 0) setMetas(config.metas);
          if (config.scale) setScale(config.scale);
        }

        // Load Session
        const session = await StorageService.loadSessionData();
        if (session) {
          setRegistros(session.registros);
          // Rehydrate Map
          const uMap = new Map<string, UserRecord>();
          session.usuarios.forEach(u => uMap.set(u.id, u));
          setUsuariosMap(uMap);
          setMessage({ type: 'info', text: 'Datos restaurados (Servidor/Local).' });
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
    initData();
  }, []);

  // Save config when changed
  useEffect(() => {
    const timer = setTimeout(() => {
      StorageService.saveConfig(metas, scale);
    }, 1000);
    return () => clearTimeout(timer);
  }, [metas, scale]);

  // --- Handlers ---

  const handleClearData = async () => {
    if (confirm('¿Estás seguro de eliminar todos los datos? Esta acción no se puede deshacer.')) {
      setRegistros([]);
      setUsuariosMap(new Map());
      await StorageService.clearData();
      setMessage({ type: 'success', text: 'Base de datos limpia correctamente.' });
    }
  };

  const handleSaveSession = async () => {
    if (registros.length === 0) {
      setMessage({ type: 'error', text: 'No hay datos para guardar.' });
      return;
    }
    setIsSaving(true);
    try {
      const success = await StorageService.saveSessionData(registros, Array.from(usuariosMap.values()));
      if (success) setMessage({ type: 'success', text: 'Datos sincronizados con éxito.' });
      else setMessage({ type: 'error', text: 'Error guardando datos (Revise conexión o tamaño).' });
    } finally {
      setIsSaving(false);
    }
  };

  const processFiles = async (ripsFiles: FileList | null, cupsFile: File | null) => {
    if (!ripsFiles || ripsFiles.length === 0 || !cupsFile) {
      setMessage({ type: 'error', text: 'Seleccione archivos RIPS (.txt) y el Maestro CUPS (.xlsx).' });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      // 1. Process Maestro
      const cupsMap = new Map<string, MaestroCupItem>();
      const cupsBuffer = await cupsFile.arrayBuffer();
      const wb = read(cupsBuffer, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: any[] = utils.sheet_to_json(ws, { defval: "" });
      
      rows.forEach(x => {
        const c = String(x["CUPS VIGENTE"] || "").trim();
        if (c) {
          cupsMap.set(c, {
            cups: c,
            tipo: String(x["Tipo Ser"] || "").trim(),
            nombre: String(x["NOMBRE CUPS"] || "").trim()
          });
        }
      });
      setMaestro(cupsMap);

      // 2. Process RIPS
      const newRegistros: RipsRecord[] = [];
      const newUsuariosMap = new Map<string, UserRecord>(usuariosMap); 

      const rxSec = /°----\s*ARCHIVO-([A-ZÁÉÍÓÚÑ_ ]+)\s*----°\|/i;

      for (let i = 0; i < ripsFiles.length; i++) {
        const txt = await ripsFiles[i].text();
        const lines = txt.split(/\r?\n/);
        let section = "";

        for (const raw of lines) {
          const l = raw.trim();
          if (!l) continue;

          const ms = l.match(rxSec);
          if (ms) {
            section = ms[1].trim().toUpperCase();
            continue;
          }

          if (l.indexOf("|") === -1) continue;

          const parts = l.split("|").map(x => x.trim());
          if (parts.length < 2) continue;

          // USUARIOS
          if (section.includes("USUARIOS")) {
             const idCand = parts.find(p => /^(?:CC|TI|RC|CE|PA|PE|CN|MS)?-?\d{4,20}$/i.test(p)) || parts[1] || "";
             const id = normalizeId(idCand);
             if (!id) continue;

             const sexo = (parts.find(p => /^(M|F)$/i.test(p)) || "").toUpperCase();
             const fnac = (parts.find(p => /^\d{4}-\d{2}-\d{2}$/.test(p) || /^\d{2}\/\d{2}\/\d{4}$/.test(p)) || "");
             
             // Extract Name Heuristics
             const posiblesNombre = parts.filter(p => /[A-Za-zÁÉÍÓÚÑ]/.test(p) && !/^(M|F)$/i.test(p) && !/^\d/.test(p));
             const nombre = posiblesNombre.slice(0, 4).join(" ");

             const prev = newUsuariosMap.get(id) || { id, sexo: "", fnac: "", nombre: "" };
             newUsuariosMap.set(id, {
               id,
               sexo: sexo || prev.sexo,
               fnac: fnac || prev.fnac,
               nombre: nombre || prev.nombre
             });
             continue;
          }

          // PROCEDIMIENTOS / OTROS
          const mC = l.match(/\b\d{6}\b/);
          if (!mC) continue;
          const cups = mC[0];
          
          if (!cupsMap.has(cups)) continue;

          const mP = l.match(/\b(?:CC|TI|RC|CE|PA|PE|CN|MS)-?\d{4,15}\b|\b\d{6,15}\b/);
          const pacienteRaw = mP ? mP[0] : "SIN_ID";
          const paciente = normalizeId(pacienteRaw) || "SIN_ID";

          const info = cupsMap.get(cups)!;
          const fecha = parseDateFromLine(l);

          newRegistros.push({
            cups,
            paciente,
            tipo: info.tipo,
            nombre: info.nombre,
            fecha
          });
        }
      }

      setRegistros(newRegistros);
      setUsuariosMap(newUsuariosMap);
      setMessage({ type: 'success', text: `Procesado: ${newRegistros.length} registros.` });

    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Error en formato de archivos.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Calculations ---

  const { stats, chartData, rankingCUPS, rankingPacientes } = useMemo(() => {
    // Filter active services
    const activeTypes = new Set(metas.filter(m => m.active).map(m => m.type));
    const filteredRegistros = registros.filter(r => activeTypes.has(r.tipo));

    // Stats
    const totalActivities = filteredRegistros.length;
    const uniquePatients = new Set(filteredRegistros.map(r => r.paciente));
    
    // Counts
    const typeCount: Record<string, number> = {};
    const cupsCount: Record<string, {count: number, name: string, type: string}> = {};
    const cupsPacCount: Record<string, Record<string, number>> = {};
    const pacCount: Record<string, {count: number, cupsCounts: Record<string, number>}> = {};

    filteredRegistros.forEach(r => {
      // Type Aggregation
      typeCount[r.tipo] = (typeCount[r.tipo] || 0) + 1;

      // CUPS Aggregation
      if (!cupsCount[r.cups]) cupsCount[r.cups] = { count: 0, name: r.nombre, type: r.tipo };
      cupsCount[r.cups].count++;

      // CUPS Patient Aggregation (for top patient per cups)
      if(!cupsPacCount[r.cups]) cupsPacCount[r.cups] = {};
      cupsPacCount[r.cups][r.paciente] = (cupsPacCount[r.cups][r.paciente] || 0) + 1;

      // Patient Aggregation
      if (!pacCount[r.paciente]) pacCount[r.paciente] = { count: 0, cupsCounts: {} };
      pacCount[r.paciente].count++;
      pacCount[r.paciente].cupsCounts[r.cups] = (pacCount[r.paciente].cupsCounts[r.cups] || 0) + 1;
    });

    // Chart Data Preparation
    const chartData: ChartDataPoint[] = metas
      .filter(m => m.active)
      .map(m => {
        const ejecutado = typeCount[m.type] || 0;
        const totalMeta = m.monthlyGoal * scale;
        let pct = totalMeta > 0 ? Math.round((ejecutado / totalMeta) * 100) : 0;
        const capPct = pct > 100 ? 100 : pct;

        let color = "#ef4444"; // red
        if (capPct >= 80) color = "#eab308"; // yellow
        if (capPct >= 100) color = "#10b981"; // green

        return {
          name: m.type,
          meta: totalMeta,
          ejecutado,
          cumplimiento: capPct,
          color
        };
      });

    // Ranking CUPS
    const rankingCUPS: RankingCupsItem[] = Object.entries(cupsCount)
      .map(([code, info]) => {
        // Find top patient for this cup
        const pacs = cupsPacCount[code] || {};
        const topPacEntry = Object.entries(pacs).sort((a,b) => b[1] - a[1])[0];
        const topPid = topPacEntry ? topPacEntry[0] : "";
        const topCnt = topPacEntry ? topPacEntry[1] : 0;
        
        const user = usuariosMap.get(topPid);
        const fn = user?.fnac || "";

        return {
          CUPS: code,
          Nombre: info.name,
          TipoSer: info.type,
          Cantidad: info.count,
          PacienteTop: topPid,
          PacienteTop_Cant: topCnt,
          PacienteTop_Nombre: user?.nombre || "",
          PacienteTop_Sexo: user?.sexo || "",
          PacienteTop_Edad: edadDetallada(fn),
          PacienteTop_GrupoEtario: grupoEtarioDesdeFN(fn)
        };
      })
      .sort((a, b) => b.Cantidad - a.Cantidad);

    // Ranking Pacientes
    const rankingPacientes: RankingPatientItem[] = Object.entries(pacCount)
      .map(([pid, info]) => {
        const user = usuariosMap.get(pid);
        const fn = user?.fnac || "";
        
        // Find Top CUPS for patient
        const topC = Object.entries(info.cupsCounts).sort((a, b) => b[1] - a[1])[0];
        // Generate services string (Top 5)
        const services = Object.keys(info.cupsCounts).slice(0, 5).join("; ");

        return {
          PacienteId: pid,
          Nombre: user?.nombre || "NO REGISTRADO",
          Sexo: user?.sexo || "-",
          Edad: edadDetallada(fn) || "-",
          GrupoEtario: grupoEtarioDesdeFN(fn) || "-",
          TotalAtenciones: info.count,
          TopCUPS: topC ? topC[0] : "",
          TopCUPS_Cant: topC ? topC[1] : 0,
          Servicios: services
        };
      })
      .sort((a, b) => b.TotalAtenciones - a.TotalAtenciones);

    // KPI Values
    const topCup = rankingCUPS[0];
    const topPat = rankingPacientes[0];

    const stats: ProcessingStats = {
      totalActivities,
      totalPatients: uniquePatients.size,
      topCupsCode: topCup?.CUPS || "—",
      topCupsName: topCup?.Nombre || "",
      topCupsCount: topCup?.Cantidad || 0,
      topPatientId: topPat?.PacienteId || "—",
      topPatientName: topPat?.Nombre || "",
      topPatientCount: topPat?.TotalAtenciones || 0
    };

    return { stats, chartData, rankingCUPS, rankingPacientes };

  }, [registros, metas, scale, usuariosMap]);


  // --- Exports ---
  const handleExport = () => {
    const wb = utils.book_new();
    utils.book_append_sheet(wb, utils.json_to_sheet(chartData), "Metas_vs_Ejecutado");
    utils.book_append_sheet(wb, utils.json_to_sheet(rankingCUPS), "Ranking_CUPS");
    utils.book_append_sheet(wb, utils.json_to_sheet(rankingPacientes), "Ranking_Pacientes");
    writeFile(wb, "Reporte_Auditoria_RIPS.xlsx");
  };

  return (
    <div className="min-h-screen pb-20 font-sans">
      {/* Header Glassmorphism */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/50 shadow-2xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <Activity className="h-6 w-6 text-indigo-400" />
              RIPS Auditoría Pro
            </h1>
            <p className="text-xs text-slate-400 font-medium">Análisis inteligente de prestación de servicios</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handleSaveSession}
              disabled={isSaving}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg ${isSaving ? 'bg-slate-800 text-slate-500 cursor-wait' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 hover:shadow-indigo-500/20 active:scale-95'}`}
            >
              {isSaving ? <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"/> : <Server className="h-4 w-4" />}
              <span>{isSaving ? 'Sincronizando...' : 'Sincronizar'}</span>
            </button>
            <button 
              onClick={handleClearData}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-slate-700/50 hover:border-red-500/30 rounded-lg text-sm font-medium transition-all shadow-md active:scale-95"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Limpiar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-8">
        
        {/* Messages */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 shadow-lg ${
            message.type === 'error' ? 'bg-red-500/10 text-red-200 border border-red-500/20' : 
            message.type === 'success' ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20' :
            'bg-blue-500/10 text-blue-200 border border-blue-500/20'
          }`}>
            {message.type === 'error' ? <AlertTriangle className="h-5 w-5 flex-shrink-0" /> : <CheckCircle className="h-5 w-5 flex-shrink-0" />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* --- Top Control Panel --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Metas Config */}
          <section className="glass-panel border border-slate-800/60 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -z-10 group-hover:bg-purple-500/10 transition-colors"></div>
            
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" /> Metas y Periodo
              </h2>
              <div className="relative">
                <select 
                  value={scale} 
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="appearance-none bg-slate-900 border border-slate-700 text-slate-200 rounded-lg text-sm pl-3 pr-8 py-1.5 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all cursor-pointer hover:border-slate-600"
                >
                  <option value="1">Mensual (x1)</option>
                  <option value="2">Bimestral (x2)</option>
                  <option value="3">Trimestral (x3)</option>
                  <option value="6">Semestral (x6)</option>
                  <option value="12">Anual (x12)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            
            <div className="max-h-[220px] overflow-y-auto pr-2 custom-scroll">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="text-xs text-slate-400 uppercase bg-slate-900/40 sticky top-0 z-10 backdrop-blur-sm">
                  <tr>
                    <th className="px-3 py-2 rounded-l-lg">On</th>
                    <th className="px-3 py-2">Servicio</th>
                    <th className="px-3 py-2 text-right rounded-r-lg">Meta Mes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {metas.map((m, idx) => (
                    <tr key={idx} className="group/row hover:bg-slate-800/40 transition-colors">
                      <td className="px-3 py-2.5 text-center">
                        <input 
                          type="checkbox" 
                          checked={m.active} 
                          onChange={(e) => {
                            const nm = [...metas];
                            nm[idx].active = e.target.checked;
                            setMetas(nm);
                          }}
                          className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-offset-0 focus:ring-purple-500/30 cursor-pointer" 
                        />
                      </td>
                      <td className="px-3 py-2.5 text-slate-300 text-xs font-medium group-hover/row:text-white transition-colors">{m.type}</td>
                      <td className="px-3 py-2.5 text-right">
                        <input 
                          type="number" 
                          value={m.monthlyGoal} 
                          onChange={(e) => {
                            const nm = [...metas];
                            nm[idx].monthlyGoal = Number(e.target.value);
                            setMetas(nm);
                          }}
                          className="w-24 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-right text-xs font-mono text-emerald-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Upload Panel */}
          <section className="glass-panel border border-slate-800/60 rounded-2xl p-6 shadow-xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-5">
              <Database className="h-5 w-5 text-blue-400" /> Carga de Datos
            </h2>
            
            <form 
              className="flex-1 flex flex-col gap-6 justify-between"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const rFiles = (form.elements.namedItem('rips') as HTMLInputElement).files;
                const cFile = (form.elements.namedItem('cups') as HTMLInputElement).files?.[0] || null;
                processFiles(rFiles, cFile);
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Archivos RIPS (.txt)
                  </label>
                  <div className="relative group">
                    <input name="rips" type="file" multiple accept=".txt" className="hidden" id="file-rips" />
                    <label 
                      htmlFor="file-rips" 
                      className="flex flex-col items-center justify-center w-full h-24 px-4 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-slate-800/50 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    >
                      <FileText className="h-8 w-8 text-slate-500 group-hover:text-blue-400 transition-colors mb-2" />
                      <span className="text-xs text-slate-400 font-medium group-hover:text-blue-300">Seleccionar TXT</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Maestro CUPS (.xlsx)
                  </label>
                  <div className="relative group">
                    <input name="cups" type="file" accept=".xlsx" className="hidden" id="file-cups" />
                    <label 
                      htmlFor="file-cups" 
                      className="flex flex-col items-center justify-center w-full h-24 px-4 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-slate-800/50 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    >
                      <FileJson className="h-8 w-8 text-slate-500 group-hover:text-emerald-400 transition-colors mb-2" />
                      <span className="text-xs text-slate-400 font-medium group-hover:text-emerald-300">Seleccionar Excel</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-auto">
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload className="h-4 w-4" /> Procesar Datos
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={handleExport}
                  disabled={registros.length === 0}
                  className="px-4 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white disabled:opacity-50 transition-all shadow-md active:scale-95"
                  title="Exportar Reporte a Excel"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* --- KPI Cards --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard 
            label="Actividades Totales" 
            value={stats.totalActivities.toLocaleString()} 
            icon={<Activity className="h-6 w-6 text-blue-400" />}
            trend="global"
            color="blue"
          />
          <KpiCard 
            label="Pacientes Únicos" 
            value={stats.totalPatients.toLocaleString()} 
            icon={<UserCheck className="h-6 w-6 text-emerald-400" />} 
            trend="distinct"
            color="emerald"
          />
          <KpiCard 
            label="CUPS Más Frecuente" 
            value={stats.topCupsCode} 
            sub={stats.topCupsName ? `${stats.topCupsCount} usos` : ""}
            icon={<BarChart3 className="h-6 w-6 text-purple-400" />} 
            trend="top"
            color="purple"
          />
           <KpiCard 
            label="Paciente Mayor Uso" 
            value={stats.topPatientId} 
            sub={stats.topPatientName ? `${stats.topPatientCount} atenciones` : ""}
            icon={<Users className="h-6 w-6 text-orange-400" />} 
            trend="user"
            color="orange"
          />
        </section>

        {/* --- Charts --- */}
        {registros.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="glass-panel border border-slate-800/60 rounded-2xl p-6 shadow-xl">
              <h3 className="text-slate-100 font-bold mb-6 text-sm flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div> Producción vs Meta (Cantidad)
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 5, right: 30, top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                      cursor={{fill: '#1e293b', opacity: 0.5}}
                    />
                    <Bar dataKey="meta" name="Meta" fill="#334155" stackId="a" barSize={20} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="ejecutado" name="Ejecutado" fill="#3b82f6" stackId="b" barSize={12} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel border border-slate-800/60 rounded-2xl p-6 shadow-xl">
              <h3 className="text-slate-100 font-bold mb-6 text-sm flex items-center gap-2">
                <div className="w-1 h-4 bg-emerald-500 rounded-full"></div> % Cumplimiento (Tope 100%)
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 5, right: 30, top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                      cursor={{fill: '#1e293b', opacity: 0.5}}
                      formatter={(val: number) => `${val}%`}
                    />
                    <ReferenceLine x={80} stroke="#eab308" strokeDasharray="3 3" />
                    <ReferenceLine x={100} stroke="#10b981" strokeDasharray="3 3" />
                    <Bar dataKey="cumplimiento" name="%" barSize={20} radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* --- Tables --- */}
        {registros.length > 0 && (
          <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Ranking Pacientes (Full Width Enhanced) */}
            <div className="glass-panel border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
              <div className="p-5 border-b border-slate-800/50 bg-slate-900/30 flex justify-between items-center">
                <h3 className="text-slate-100 font-bold text-base flex items-center gap-2">
                  <div className="p-1.5 bg-orange-500/10 rounded-lg">
                    <Users className="h-5 w-5 text-orange-400" />
                  </div>
                  Ranking de Usuarios
                </h3>
                <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">Top {rankingPacientes.length > 100 ? 100 : rankingPacientes.length}</span>
              </div>
              
              <div className="overflow-auto custom-scroll flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase tracking-wider sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                    <tr>
                      <th className="p-4 font-semibold w-12 text-center">#</th>
                      <th className="p-4 font-semibold">Paciente</th>
                      <th className="p-4 font-semibold">Nombre Completo</th>
                      <th className="p-4 font-semibold text-center w-20">Sexo</th>
                      <th className="p-4 font-semibold text-center w-24">Edad</th>
                      <th className="p-4 font-semibold">Grupo Etario</th>
                      <th className="p-4 font-semibold text-right">Total Atenciones</th>
                      <th className="p-4 font-semibold">Top CUPS</th>
                      <th className="p-4 font-semibold text-right">Cant.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                    {rankingPacientes.slice(0, 100).map((item, i) => (
                      <tr key={i} className="group hover:bg-slate-800/40 transition-colors duration-150">
                        <td className="p-4 text-center text-slate-600 group-hover:text-slate-400">{i + 1}</td>
                        <td className="p-4 font-mono text-orange-300 font-medium">{item.PacienteId}</td>
                        <td className="p-4 text-slate-300 font-medium">
                          {item.Nombre}
                        </td>
                        <td className="p-4 text-center text-slate-400">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.Sexo === 'F' ? 'bg-pink-500/10 text-pink-400' : item.Sexo === 'M' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                            {item.Sexo}
                          </span>
                        </td>
                        <td className="p-4 text-center text-slate-400">{item.Edad}</td>
                        <td className="p-4 text-slate-400 text-xs">{item.GrupoEtario}</td>
                        <td className="p-4 text-right">
                          <span className="inline-block min-w-[30px] text-center bg-slate-800 text-emerald-400 font-bold px-2 py-1 rounded border border-slate-700">
                            {item.TotalAtenciones}
                          </span>
                        </td>
                        <td className="p-4">
                           <div className="flex flex-col">
                             <span className="font-mono text-blue-300 text-xs">{item.TopCUPS}</span>
                           </div>
                        </td>
                         <td className="p-4 text-right font-mono text-slate-300">{item.TopCUPS_Cant}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ranking CUPS (Updated Visuals) */}
            <div className="glass-panel border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[500px]">
              <div className="p-5 border-b border-slate-800/50 bg-slate-900/30 flex justify-between items-center">
                 <h3 className="text-slate-100 font-bold text-base flex items-center gap-2">
                  <div className="p-1.5 bg-purple-500/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>
                  Ranking CUPS
                </h3>
              </div>
              <div className="overflow-auto custom-scroll p-0">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase tracking-wider sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                      <th className="p-4 w-12 text-center">#</th>
                      <th className="p-4 w-32">Código</th>
                      <th className="p-4">Nombre Procedimiento</th>
                      <th className="p-4 text-right">Cantidad</th>
                      <th className="p-4 text-right">Top Paciente (ID)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {rankingCUPS.slice(0, 100).map((item, i) => (
                      <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 text-center text-slate-600">{i + 1}</td>
                        <td className="p-4 font-mono text-purple-300">{item.CUPS}</td>
                        <td className="p-4 text-slate-300 truncate max-w-[300px]" title={item.Nombre}>{item.Nombre}</td>
                        <td className="p-4 text-right font-bold text-white">{item.Cantidad}</td>
                        <td className="p-4 text-right text-xs">
                           <div className="font-mono text-slate-400">{item.PacienteTop || "-"}</div>
                           {item.PacienteTop_Cant > 0 && <div className="text-slate-600">({item.PacienteTop_Cant})</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

function KpiCard({ label, value, sub, icon, color, trend }: { label: string, value: string | number, sub?: string, icon: React.ReactNode, color: string, trend: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'hover:shadow-blue-500/10 border-blue-500/20',
    emerald: 'hover:shadow-emerald-500/10 border-emerald-500/20',
    purple: 'hover:shadow-purple-500/10 border-purple-500/20',
    orange: 'hover:shadow-orange-500/10 border-orange-500/20',
  };

  return (
    <div className={`glass-panel border border-slate-800/60 p-5 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-opacity-50 ${colorClasses[color]}`}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <div className={`p-2 rounded-lg bg-${color}-500/10`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-white tracking-tight truncate" title={String(value)}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1 font-medium truncate">{sub}</div>}
    </div>
  );
}

export default App;