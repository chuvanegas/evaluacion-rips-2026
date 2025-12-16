import { ServiceTypeMeta, RipsRecord, UserRecord } from '../types';

const KEYS = {
  METAS: 'rips_dashboard_metas',
  REGISTROS: 'rips_dashboard_registros',
  USUARIOS: 'rips_dashboard_usuarios',
  SCALE: 'rips_dashboard_scale'
};

// Helper para fallback
const isServerAvailable = async (): Promise<boolean> => {
  try {
    const res = await fetch('/api/config', { method: 'HEAD' });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const StorageService = {
  // --- Configuration (Metas & Scale) ---
  
  saveConfig: async (metas: ServiceTypeMeta[], scale: number) => {
    // 1. Try Server
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metas, scale })
      });
    } catch (e) {
      console.warn("Server offline, saving config locally");
    }
    // 2. Always save local as backup
    localStorage.setItem(KEYS.METAS, JSON.stringify(metas));
    localStorage.setItem(KEYS.SCALE, String(scale));
  },

  getConfig: async (): Promise<{ metas: ServiceTypeMeta[], scale: number } | null> => {
    // 1. Try Server
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        // Update local cache
        if (data.metas) localStorage.setItem(KEYS.METAS, JSON.stringify(data.metas));
        if (data.scale) localStorage.setItem(KEYS.SCALE, String(data.scale));
        return data;
      }
    } catch (e) {
      console.warn("Server offline, loading config from local");
    }

    // 2. Fallback Local
    const m = localStorage.getItem(KEYS.METAS);
    const s = localStorage.getItem(KEYS.SCALE);
    if (m || s) {
      return {
        metas: m ? JSON.parse(m) : [],
        scale: s ? Number(s) : 1
      };
    }
    return null;
  },

  // --- Session Data (Big Data) ---

  saveSessionData: async (registros: RipsRecord[], usuarios: UserRecord[]): Promise<boolean> => {
    let saved = false;
    
    // 1. Try Server
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registros, usuarios })
      });
      if (res.ok) saved = true;
    } catch (e) {
      console.error("Server save failed", e);
    }

    // 2. Try Local (Backup)
    try {
      localStorage.setItem(KEYS.REGISTROS, JSON.stringify(registros));
      localStorage.setItem(KEYS.USUARIOS, JSON.stringify(usuarios));
      saved = true; 
    } catch (e) {
      console.error("Local storage full", e);
    }

    return saved;
  },

  loadSessionData: async (): Promise<{ registros: RipsRecord[], usuarios: UserRecord[] } | null> => {
    // 1. Try Server
    try {
      const res = await fetch('/api/session');
      if (res.ok) {
        const data = await res.json();
        if (data.registros && data.registros.length > 0) {
          return { registros: data.registros, usuarios: data.usuarios || [] };
        }
      }
    } catch (e) {
      console.warn("Server offline, checking local storage");
    }

    // 2. Fallback Local
    try {
      const regRaw = localStorage.getItem(KEYS.REGISTROS);
      const usrRaw = localStorage.getItem(KEYS.USUARIOS);
      if (regRaw && usrRaw) {
        return {
          registros: JSON.parse(regRaw),
          usuarios: JSON.parse(usrRaw)
        };
      }
    } catch (e) {
      return null;
    }
    return null;
  },

  clearData: async () => {
    // Clear Server
    try {
      await fetch('/api/session', { method: 'DELETE' });
    } catch (e) {}
    
    // Clear Local
    localStorage.removeItem(KEYS.REGISTROS);
    localStorage.removeItem(KEYS.USUARIOS);
  }
};
