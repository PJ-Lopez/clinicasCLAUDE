"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { loginUser } from "@/action/auth-action";

const schema = z.object({
  email: z.string().email({ message: "Ingresa un correo válido." }),
  password: z.string().min(1, { message: "Ingresa tu contraseña." }),
});
type LoginValues = z.infer<typeof schema>;

const LoginForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginValues) => {
    setFormError(null);
    startTransition(async () => {
      const { error } = await loginUser(data);
      if (error) {
        setFormError(error);
        return;
      }
      toast.success("Sesión iniciada");
      // Navegación completa para que el layout protegido lea la sesión nueva.
      window.location.href = "/es/dashboard/analytics";
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7 space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email" className="font-medium text-default-600">
          Correo electrónico
        </Label>
        <Input
          size="lg"
          id="email"
          type="email"
          autoComplete="username"
          placeholder="usuario@clinicas.local"
          disabled={isPending}
          {...register("email")}
          className={cn({ "border-destructive": errors.email })}
        />
        {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="font-medium text-default-600">
          Contraseña
        </Label>
        <div className="relative">
          <Input
            size="lg"
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            disabled={isPending}
            {...register("password")}
            className={cn("pe-11", { "border-destructive": errors.password })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 -translate-y-1/2 end-4 text-default-400"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            <Icon icon={showPassword ? "heroicons:eye-slash" : "heroicons:eye"} className="w-5 h-5" />
          </button>
        </div>
        {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
      </div>

      {formError && (
        <div role="alert" className="rounded-md bg-destructive/10 text-destructive text-sm px-3 py-2">
          {formError}
        </div>
      )}

      <Button fullWidth disabled={isPending}>
        {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
        {isPending ? "Ingresando..." : "Iniciar sesión"}
      </Button>

      <p className="text-xs text-default-500 text-center">
        Por seguridad, la sesión se cierra automáticamente después de 30 minutos.
      </p>
    </form>
  );
};

export default LoginForm;
