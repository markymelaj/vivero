import "server-only";
import { backofficeConfig, requireBackofficeEnv } from "./config";

function baseHeaders(extra?: HeadersInit): HeadersInit {
  requireBackofficeEnv();
  return {
    apikey: backofficeConfig.serviceRoleKey,
    Authorization: `Bearer ${backofficeConfig.serviceRoleKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

function apiUrl(path: string) {
  const base = backofficeConfig.supabaseUrl.replace(/\/$/, "");
  return `${base}/rest/v1/${path.replace(/^\//, "")}`;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `Error Supabase REST ${res.status}`);
  }
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export async function selectRows<T>(resource: string, params?: Record<string, string | number | boolean | undefined | null>): Promise<T[]> {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  });
  const qs = search.toString();
  const res = await fetch(apiUrl(`${resource}${qs ? `?${qs}` : ""}`), {
    headers: baseHeaders(),
    cache: "no-store",
  });
  return parseResponse<T[]>(res);
}

export async function insertRow<T>(resource: string, payload: unknown): Promise<T> {
  const res = await fetch(apiUrl(resource), {
    method: "POST",
    headers: baseHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await parseResponse<T[]>(res);
  return data[0];
}

export async function updateRows<T>(resource: string, query: string, payload: unknown): Promise<T[]> {
  const res = await fetch(apiUrl(`${resource}?${query}`), {
    method: "PATCH",
    headers: baseHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  return parseResponse<T[]>(res);
}

export async function rpc<T>(fnName: string, payload: unknown): Promise<T> {
  const res = await fetch(apiUrl(`rpc/${fnName}`), {
    method: "POST",
    headers: baseHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  return parseResponse<T>(res);
}

export function eq(value: string) {
  // No encodeamos acá: URLSearchParams se encarga de codificar una sola vez.
  // Si codificamos dos veces, admin@paesaggio.local queda como admin%2540... y no matchea.
  return `eq.${value}`;
}

export function ilike(value: string) {
  // URLSearchParams codifica espacios, acentos y símbolos al construir la query final.
  return `ilike.%${value}%`;
}
