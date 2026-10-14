"use client";
import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";

/**
 * Cerrar sesión sin <form>: al hacer clic, el menú se cierra y desmonta su
 * contenido; un form adentro se quitaba de la página antes de enviarse y la
 * sesión no se cerraba. signOut() de next-auth/react borra la cookie y hace
 * una recarga completa hacia el login.
 */
const LogoutItem = () => (
  <DropdownMenuItem
    onSelect={() => signOut({ redirectTo: "/es" })}
    className="flex items-center gap-2 text-sm font-medium text-default-600 px-3 py-1.5 my-1 cursor-pointer"
  >
    <Icon icon="heroicons:power" className="w-4 h-4" />
    Cerrar sesión
  </DropdownMenuItem>
);

export default LogoutItem;
