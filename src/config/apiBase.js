import Constants from 'expo-constants';

let cache;

const PRODUCTION_DEFAULT = 'https://visaoderuastore.com.br';

/** Remove barra final e sufixo `/api` quando o cliente já concatena `/api/...`. */
function normalizeApiBase(raw) {
  let b = String(raw || '').trim().replace(/\/$/, '');
  if (/\/api$/i.test(b)) {
    b = b.replace(/\/api$/i, '');
  }
  return b.replace(/\/$/, '');
}

/**
 * URL base do domínio, **sem** `/api` no final (ex.: https://visaoderuastore.com.br).
 * Chamadas HTTP usam caminhos como `/api/auth/login` → resultado: …/api/auth/login.
 *
 * Ordem: EXPO_PUBLIC_API_URL → app.json extra.apiUrl → produção Visa de Rua.
 *
 * - Dev local: use `.env` com `EXPO_PUBLIC_API_URL=http://127.0.0.1:4000` (ou Android emulador `http://10.0.2.2:4000`).
 */
export function getApiBaseUrl() {
  if (cache) return cache;
  const fromEnv = typeof process.env.EXPO_PUBLIC_API_URL === 'string' ? process.env.EXPO_PUBLIC_API_URL.trim() : '';
  const fromExtra =
    typeof Constants.expoConfig?.extra?.apiUrl === 'string' ? Constants.expoConfig.extra.apiUrl.trim() : '';
  const raw = fromEnv || fromExtra || PRODUCTION_DEFAULT;
  cache = normalizeApiBase(raw);
  return cache;
}
