const BASE = '/api';
function getToken() { return localStorage.getItem('fn_token') || ''; }
async function request(method: string, path: string, body?: any, auth = false) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${getToken()}`;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) { const err = await res.json().catch(() => ({ detail: res.statusText })); throw new Error(err.detail || 'Erro'); }
  return res.json();
}
export const api = {
  register: (d: any) => request('POST', '/auth/register', d),
  login: (d: any) => request('POST', '/auth/login', d),
  me: () => request('GET', '/auth/me', undefined, true),
  getScrims: () => request('GET', '/scrims'),
  createScrim: (d: any) => request('POST', '/scrims', d, true),
  updateScrim: (id: string, d: any) => request('PATCH', `/scrims/${id}`, d, true),
  deleteScrim: (id: string) => request('DELETE', `/scrims/${id}`, undefined, true),
  inscribeScrim: (sid: string, d: any) => request('POST', `/scrims/${sid}/inscriptions`, d, true),
  getInscriptions: (sid: string) => request('GET', `/scrims/${sid}/inscriptions`, undefined, true),
  getProducts: () => request('GET', '/products'),
  getAllProducts: () => request('GET', '/products/all', undefined, true),
  createProduct: (d: any) => request('POST', '/products', d, true),
  updateProduct: (id: string, d: any) => request('PATCH', `/products/${id}`, d, true),
  deleteProduct: (id: string) => request('DELETE', `/products/${id}`, undefined, true),
  getNews: () => request('GET', '/news'),
  createNews: (d: any) => request('POST', '/news', d, true),
  deleteNews: (id: string) => request('DELETE', `/news/${id}`, undefined, true),
};
export function saveToken(t: string) { localStorage.setItem('fn_token', t); }
export function clearToken() { localStorage.removeItem('fn_token'); }
export function isLoggedIn() { return !!getToken(); }
export default api;
