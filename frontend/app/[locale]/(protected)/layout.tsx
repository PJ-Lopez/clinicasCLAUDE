import LayoutProvider from "@/providers/layout.provider";
import LayoutContentProvider from "@/providers/content.provider";
import DashCodeSidebar from '@/components/partials/sidebar'
import DashCodeFooter from '@/components/partials/footer'
import ThemeCustomize from '@/components/partials/customizer'
import DashCodeHeader from '@/components/partials/header'
import { auth } from "@/lib/auth";
import { redirect } from "@/components/navigation";
const layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();

    if (!session) {
        // Sin sesión (o token de 30 min vencido) → al login.
        redirect({ href: '/', locale: 'es' })
    }
    return (
        <LayoutProvider >
            <ThemeCustomize />
            <DashCodeHeader />
            <DashCodeSidebar />
            <LayoutContentProvider>
                {children}
            </LayoutContentProvider>
            <DashCodeFooter />
        </LayoutProvider>
    )


};

export default layout;
