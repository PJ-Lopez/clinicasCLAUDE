import { Metadata } from "next";
import ModulePlaceholder from "@/components/module-placeholder";

export const metadata: Metadata = { title: "Condiciones crónicas | Clínicas" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Condiciones crónicas"
      description="Aquí se registrarán las condiciones crónicas que generan alertas de seguimiento."
      icon="heroicons-outline:heart"
    />
  );
}
