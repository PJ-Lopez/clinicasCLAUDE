import { Metadata } from "next";
import ModulePlaceholder from "@/components/module-placeholder";

export const metadata: Metadata = { title: "Recetas | Clínicas" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Recetas"
      description="Aquí se emitirán recetas con medicamentos y muestras médicas."
      icon="heroicons-outline:document-text"
    />
  );
}
