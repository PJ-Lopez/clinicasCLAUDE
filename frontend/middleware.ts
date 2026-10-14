import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { locales } from "@/config";

// Proyecto solo en español: un único locale, sin selector de idioma.
const handleI18nRouting = createMiddleware({ locales, defaultLocale: "es" });

const LOGIN_PATH = /^\/(es)?\/?$/; // "/" y "/es" muestran el login
const PUBLIC_PATHS = [LOGIN_PATH, /^\/es\/auth\/login\/?$/];

/**
 * Protección de rutas antes de renderizar:
 * - Sin sesión (o con el token de 30 min vencido) → 307 al login.
 * - Con sesión, entrar al login → al dashboard.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isPublic = PUBLIC_PATHS.some((re) => re.test(pathname));

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/es", req.url));
  }
  if (isLoggedIn && LOGIN_PATH.test(pathname)) {
    return NextResponse.redirect(new URL("/es/dashboard/analytics", req.url));
  }
  return handleI18nRouting(req);
});

export const config = {
  matcher: ["/", "/(es)/:path*"],
};
