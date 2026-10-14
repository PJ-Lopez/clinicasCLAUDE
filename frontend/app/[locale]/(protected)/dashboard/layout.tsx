import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio | Clínicas",
  description: "Panel principal del sistema de gestión clínica.",
};

// Sin el título automático ni el selector de fechas de la plantilla.
const Layout = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export default Layout;
