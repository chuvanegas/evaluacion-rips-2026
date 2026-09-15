const PB_URL   = 'https://evaluacion-db.duckdns.org';
const PB_EMAIL = 'jd_vanegas@hotmail.com';
const PB_PASS  = 'Vanegas1920';

let _token: string | null = null;
let _tokenExpiry = 0;

async function getToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry) return _token!;
  try {
    const res = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: PB_EMAIL, password: PB_PASS })
    });
    const data = await res.json();
    _token = data.token;
    _tokenExpiry = Date.now() + 11 * 60 * 60 * 1000; // 11 horas
    return _token!;
  } catch {
    return '';
  }
}

async function pbGet(path: string): Promise<any> {
  const token = await getToken();
  const res = await fetch(`${PB_URL}${path}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`PB error ${res.status}`);
  return res.json();
}

async function pbPost(path: string, body: any, method = 'POST'): Promise<any> {
  const token = await getToken();
  const res = await fetch(`${PB_URL}${path}`, {
    method,
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`PB error ${res.status}`);
  return res.json();
}

export const CloudStorage = {
  async get(key: string): Promise<any> {
    try {
      const filter = encodeURIComponent(`key='${key}'`);
      const data = await pbGet(`/api/collections/app_storage/records?filter=(${filter})&perPage=1`);
      return data?.items?.[0]?.value ?? null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: any): Promise<void> {
    try {
      const filter = encodeURIComponent(`key='${key}'`);
      const existing = await pbGet(`/api/collections/app_storage/records?filter=(${filter})&perPage=1`);
      const record = existing?.items?.[0];
      if (record) {
        await pbPost(`/api/collections/app_storage/records/${record.id}`, { value }, 'PATCH');
      } else {
        await pbPost(`/api/collections/app_storage/records`, { key, value });
      }
    } catch (e) {
      console.warn('CloudStorage.set failed', e);
    }
  },

  async getAll(keys: string[]): Promise<Record<string, any>> {
    try {
      const filter = encodeURIComponent(keys.map(k => `key='${k}'`).join('||'));
      const data = await pbGet(`/api/collections/app_storage/records?filter=(${filter})&perPage=50`);
      return Object.fromEntries((data?.items || []).map((r: any) => [r.key, r.value]));
    } catch {
      return {};
    }
  }
};
