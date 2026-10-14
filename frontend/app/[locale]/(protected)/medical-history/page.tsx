import { Metadata } from "next";
import ModulePlaceholder from "@/components/module-placeholder";

export const metadata: Metadata = { title: "Historial médico | Clínicas" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Historial médico"
      description="Aquí se consultarán y registrarán las consultas y diagnósticos de cada paciente."
      icon="heroicons-outline:clipboard-list"
    />
  );
}
