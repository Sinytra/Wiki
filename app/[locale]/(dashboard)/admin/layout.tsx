import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {pick} from "lodash";
import {assertUserIsAdmin} from "@/lib/admin";
import {AdminSidebar} from "@/components/admin/AdminSidebar";
import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ params, children }: {
  params: { locale: string };
  children: ReactNode;
}) {
  setContextLocale(params.locale);
  const profile = (await assertUserIsAdmin())!!;

  const messages = await getMessages();

  return (
    <div className="w-full mx-auto sm:max-w-[92rem]">
      <SidebarProvider className="min-h-0">
        <NextIntlClientProvider messages={pick(messages, 'AdminSidebar', 'DevSidebarContextSwitcher', 'DevSidebarUser')}>
          <AdminSidebar profile={profile} />
        </NextIntlClientProvider>

        <SidebarInset className="px-1 sm:px-4 my-4 mx-auto min-h-0 w-full">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}