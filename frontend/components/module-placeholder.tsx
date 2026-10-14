import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/i18n/routing";

type Props = { title: string; description: string; icon: string };

/**
 * Página provisional de cada módulo del menú. Los CRUD aún no se integran;
 * cuando se haga, se reemplaza el page.tsx del módulo por su pantalla real.
 */
const ModulePlaceholder = ({ title, description, icon }: Props) => (
  <div className="space-y-6">
    <h1 className="text-2xl font-medium text-default-900">{title}</h1>
    <Card>
      <CardContent className="flex flex-col items-center text-center gap-4 py-16 px-6">
        <span className="h-14 w-14 rounded-full bg-primary/10 text-primary grid place-items-center">
          <Icon icon={icon} className="w-7 h-7" />
        </span>
        <div className="space-y-1">
          <p className="font-medium text-default-900">Módulo en construcción</p>
          <p className="text-sm text-default-500 max-w-md">{description}</p>
        </div>
        <Link href="/dashboard/analytics" className="text-sm font-medium text-primary hover:underline">
          Volver al inicio
        </Link>
      </CardContent>
    </Card>
  </div>
);

export default ModulePlaceholder;
