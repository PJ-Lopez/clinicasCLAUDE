import { Metadata } from "next";
import ModulePlaceholder from "@/components/module-placeholder";

export const metadata: Metadata = { title: "Citas | Clínicas" };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Citas"
      description="Aquí se agendarán las citas y se actualizará su estado."
      icon="heroicons-outline:calendar"
    />
  );
}
