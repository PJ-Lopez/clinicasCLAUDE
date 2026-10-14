import { Metadata } from "next";
import ModulePlaceholder from "@/components/module-placeholder";

export const metadata: Metadata = { title: "Alertas | Clínicas" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Alertas"
      description="Aquí se verán y resolverán las alertas de pacientes crónicos."
      icon="heroicons-outline:bell"
    />
  );
}
