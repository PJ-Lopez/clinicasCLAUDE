import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { auth } from "@/lib/auth";
import LogoutItem from "./logout-item";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  doctor: "Médico",
  nurse: "Enfermería",
  receptionist: "Recepción",
  pharmacist: "Farmacia",
};

function initials(name?: string | null) {
  return (name ?? "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

const Avatar = ({ name }: { name?: string | null }) => (
  <span className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm font-semibold">
    {initials(name)}
  </span>
);

const ProfileInfo = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="md:block hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <div className="flex items-center gap-3 text-default-800">
            <Avatar name={user?.name} />
            <div className="text-sm font-medium lg:block hidden">{user?.name}</div>
            <span className="text-base me-2.5 lg:inline-block hidden">
              <Icon icon="heroicons-outline:chevron-down" />
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 p-0" align="end">
          <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
            <Avatar name={user?.name} />
            <div>
              <div className="text-sm font-medium text-default-800">{user?.name}</div>
              <div className="text-xs text-default-600">{user?.email}</div>
              <div className="text-xs text-default-500">{ROLE_LABELS[user?.role ?? ""] ?? user?.role}</div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="mb-0 dark:bg-background" />
          <LogoutItem />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileInfo;
