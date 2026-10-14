import { Metadata } from "next";
import ModulePlaceholder from "@/components/module-placeholder";

export const metadata: Metadata = { title: "Farmacia | Clínicas" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Farmacia"
      description="Aquí se administrará el banco de productos de farmacia y muestras médicas."
      icon="heroicons-outline:beaker"
    />
  );
}
