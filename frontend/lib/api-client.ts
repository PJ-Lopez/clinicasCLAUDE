/**
 * Cliente HTTP central hacia el backend NestJS.
 * Regla del proyecto: los componentes NO llaman a fetch directamente;
 * todo pasa por aquí (login hoy, CRUDs después).
 */

// En el servidor se usa API_URL; en el navegador, NEXT_PUBLIC_API_URL.
const API_URL =
  (typeof window === "undefined" ? process.env.API_URL : undefined) ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001/api";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, headers, ...rest } = options;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor. ¿Está corriendo el backend?");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = Array.isArray(data?.message) ? data.message.join(", ") : data?.message;
    throw new ApiError(res.status, msg ?? `Error ${res.status}`);
  }
  return data as T;
}

// ── Auth ─────────────────────────────────────────────

export type LoginResponse = {
  accessToken: string;
  user: { id: number; email: string; fullName: string; role: string };
};

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>("/auth/login", { method: "POST", body: { email, password } }),
};
