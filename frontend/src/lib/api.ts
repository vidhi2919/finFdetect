// src/lib/api.ts

const API_BASE =
  typeof window !== "undefined"
    ? (window as any).__API_BASE__ ||
      import.meta.env?.NEXT_PUBLIC_API_BASE_URL ||
     "http://15.206.90.105"
    :  "http://15.206.90.105";

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed: ${res.status} ${text}`);
  }

  return (await res.json()) as T;
}
