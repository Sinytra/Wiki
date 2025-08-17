import {SidebarInset, SidebarProvider} from "@repo/ui/components/sidebar";
import {assertUserIsAdmin} from "@/lib/admin";
import {AdminSidebar} from "@/components/admin/AdminSidebar";
import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";

export const dynamic = 'force-dynamic';

export default async function AdminLayout(
  props: {
    params: Promise<{ locale: string }>;
    children: ReactNode;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  setContextLocale(params.locale);
  await assertUserIsAdmin();

  return (
    <div className="mx-auto w-full sm:max-w-[92rem]">
      <SidebarProvider className="min-h-0">
        <ClientLocaleProvider keys={['AdminSidebar', 'DevSidebarContextSwitcher', 'DevSidebarUser']}>
          <AdminSidebar />
        </ClientLocaleProvider>

        <SidebarInset className="mx-auto my-4 min-h-0 w-full px-1 sm:px-4">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}