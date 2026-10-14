import { Metadata } from "next";
import ModulePlaceholder from "@/components/module-placeholder";

export const metadata: Metadata = { title: "Pacientes | Clínicas" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Pacientes"
      description="Aquí se registrarán los pacientes y se marcarán los prioritarios y fallecidos."
      icon="heroicons-outline:users"
    />
  );
}
