"use server";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Correo o contraseña incorrectos.",
  backend_unavailable: "No se pudo conectar con el servidor. Intenta de nuevo.",
};

/** Devuelve { error } en vez de lanzar, para mostrarlo en el formulario. */
export const loginUser = async (data: { email: string; password: string }) => {
  try {
    await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    return { error: null as string | null };
  } catch (error) {
    if (error instanceof AuthError) {
      const code = (error as AuthError & { code?: string }).code ?? "";
      return { error: MESSAGES[code] ?? "No se pudo iniciar sesión." };
    }
    throw error;
  }
};
