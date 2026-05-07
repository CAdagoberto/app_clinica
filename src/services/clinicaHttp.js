import { getApiBaseUrl } from '../config/apiBase';

async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * @param {string} method
 * @param {string} path - começa com `/api/...`
 * @param {{ body?: object, headers?: Record<string, string> }} [options]
 */
export async function apiFetch(method, path, options = {}) {
  const { body, headers = {} } = options;
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const opts = {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  let res;
  try {
    res = await fetch(url, opts);
  } catch (e) {
    const hint =
      e?.message === 'Network request failed'
        ? ` Confira EXPO_PUBLIC_API_URL (base atual: ${getApiBaseUrl()}).`
        : '';
    throw new Error(`${e?.message || 'Falha de rede'}${hint}`);
  }

  const data = await parseJsonResponse(res);
  if (!res.ok) {
    const msg =
      data && typeof data === 'object' && data.error ? String(data.error) : typeof data === 'string' ? data : `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data;
}

export function apiGet(path, options) {
  return apiFetch('GET', path, options);
}

export function apiPost(path, body, options) {
  return apiFetch('POST', path, { ...options, body });
}

export function apiPut(path, body, options) {
  return apiFetch('PUT', path, { ...options, body });
}

export function apiPatch(path, body, options) {
  return apiFetch('PATCH', path, { ...options, body });
}
