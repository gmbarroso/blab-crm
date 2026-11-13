import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { NoOrganization } from "@/components/layout/no-organization";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireUser } from "@/server/auth/session";
import { OrganizationAccessError, resolveOrganization } from "@/server/services/organization-service";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  let context;
  try {
    context = await resolveOrganization(user.id);
  } catch (error) {
    if (!(error instanceof OrganizationAccessError)) throw error;
    return <NoOrganization />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <AppHeader user={{ name: user.name, email: user.email }} organization={context.organization.name} />
        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
