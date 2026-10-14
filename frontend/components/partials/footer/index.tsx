import React from "react";
import FooterContent from "./footer-content";

// Footer simple: se quitaron los accesos móviles a chat/notificaciones de la plantilla.
const DashCodeFooter = async () => {
  return (
    <FooterContent>
      <div className="text-center md:text-start text-sm text-default-600">
        © {new Date().getFullYear()} Clínicas · Sistema de gestión de consultas clínicas
      </div>
    </FooterContent>
  );
};

export default DashCodeFooter;
