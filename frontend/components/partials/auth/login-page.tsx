import Image from "next/image";
import LoginForm from "@/components/partials/auth/login-form";
import Copyright from "@/components/partials/auth/copyright";
import { siteConfig } from "@/config/site";

/** Pantalla de login compartida por "/" y "/auth/login". */
const LoginPage = () => {
  return (
    <div className="flex w-full items-center overflow-hidden min-h-dvh h-dvh basis-full">
      <div className="overflow-y-auto flex flex-wrap w-full h-dvh">
        <div className="lg:block hidden flex-1 overflow-hidden text-[40px] leading-[48px] text-default-600 relative z-1 bg-default-50">
          <div className="max-w-[520px] pt-20 ps-20">
            <p className="mb-6 text-2xl font-bold text-default-900">{siteConfig.name}</p>
            <h4>
              Gestión de consultas
              <span className="text-default-800 font-bold ms-2">clínicas</span>
            </h4>
          </div>
          <div className="absolute left-0 2xl:bottom-[-160px] bottom-[-130px] h-full w-full z-[-1]">
            <Image src="/images/auth/ils1.svg" alt="" priority width={300} height={300} className="mb-10 w-full h-full" />
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="h-full flex flex-col dark:bg-default-100 bg-white">
            <div className="max-w-[524px] md:px-[42px] md:py-[44px] p-7 mx-auto w-full text-2xl text-default-900 mb-3 h-full flex flex-col justify-center">
              <p className="lg:hidden text-center mb-6 text-xl font-bold">{siteConfig.name}</p>
              <div className="text-center 2xl:mb-10 mb-4">
                <h4 className="font-medium">Iniciar sesión</h4>
                <div className="text-default-500 text-base">Ingresa con tu usuario del sistema</div>
              </div>
              <LoginForm />
            </div>
            <div className="text-xs font-normal text-default-500 z-999 pb-10 text-center">
              <Copyright />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
