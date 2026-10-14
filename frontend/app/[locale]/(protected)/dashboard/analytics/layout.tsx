import { Metadata } from "next";

export const metadata:Metadata={
  title: 'Inicio | Clínicas',
  description: 'Panel principal del sistema de gestión clínica'
}
const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      {children}
    </>
  );
};

export default Layout;