import { Metadata } from "next";
import ModulePlaceholder from "@/components/module-placeholder";

export const metadata: Metadata = { title: "Usuarios | Clínicas" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Usuarios"
      description="Aquí se administrarán los usuarios del sistema y sus roles."
      icon="heroicons-outline:user-circle"
    />
  );
}
