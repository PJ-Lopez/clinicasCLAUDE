import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ApiError, authApi } from "./api-client";

// El backend emite un JWT que vence a los 30 minutos; la sesión del frontend dura lo mismo.
const SESSION_MAX_AGE_SECONDS = 30 * 60;

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: { id: string; role: string } & DefaultSession["user"];
  }
  interface User {
    role?: string;
    accessToken?: string;
    accessTokenExpires?: number;
  }
}

class InvalidCredentials extends CredentialsSignin {
  code = "invalid_credentials";
}
class BackendUnavailable extends CredentialsSignin {
  code = "backend_unavailable";
}

/** Lee el `exp` del JWT del backend (sin verificar firma: eso lo hace el backend). */
function tokenExpiry(token: string): number {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    return payload.exp * 1000;
  } catch {
    return Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SECONDS },
  pages: { signIn: "/" },
  providers: [
    CredentialsProvider({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");
        try {
          const { accessToken, user } = await authApi.login(email, password);
          return {
            id: String(user.id),
            name: user.fullName,
            email: user.email,
            role: user.role,
            accessToken,
            accessTokenExpires: tokenExpiry(accessToken),
          };
        } catch (err) {
          if (err instanceof ApiError && err.status === 401) throw new InvalidCredentials();
          throw new BackendUnavailable();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.accessTokenExpires = user.accessTokenExpires;
        token.role = user.role;
      }
      // Token del backend vencido → se termina la sesión y se vuelve al login.
      if (typeof token.accessTokenExpires === "number" && Date.now() >= token.accessTokenExpires) {
        return null;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      return session;
    },
  },
});
