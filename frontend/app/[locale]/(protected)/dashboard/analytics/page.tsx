import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { auth } from "@/lib/auth";

// Inicio provisional. Los CRUD de cada módulo se integran en una fase posterior.
const MODULES = [
  { label: "Pacientes", desc: "Registro, prioritarios y fallecidos", icon: "heroicons-outline:users" },
  { label: "Citas", desc: "Agenda y estado de las citas", icon: "heroicons-outline:calendar" },
  { label: "Historial médico", desc: "Consultas y diagnósticos", icon: "heroicons-outline:clipboard-list" },
  { label: "Alertas", desc: "Seguimiento de pacientes crónicos", icon: "heroicons-outline:bell" },
  { label: "Recetas", desc: "Medicamentos y muestras recetadas", icon: "heroicons-outline:document-text" },
  { label: "Farmacia", desc: "Banco de productos y muestras médicas", icon: "heroicons-outline:beaker" },
];

const DashboardPage = async () => {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido{firstName ? `, ${firstName}` : ""}</CardTitle>
        </CardHeader>
        <CardContent className="text-default-600 text-sm">
          Usa el menú lateral para entrar a cada módulo. Tu sesión vence a los 30 minutos de iniciar sesión.
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MODULES.map((m) => (
          <Card key={m.label}>
            <CardContent className="flex items-start gap-3 p-5">
              <span className="h-10 w-10 shrink-0 rounded-md bg-primary/10 text-primary grid place-items-center">
                <Icon icon={m.icon} className="w-5 h-5" />
              </span>
              <div>
                <div className="font-medium text-default-900">{m.label}</div>
                <div className="text-sm text-default-500">{m.desc}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
