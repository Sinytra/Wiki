import {DeveloperSidebar} from "@/components/dev/sidebar/DeveloperSidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {pick} from "lodash";
import authSession from "@/lib/authSession";

export const dynamic = 'force-dynamic';

export default async function DevLayout({ children }: { children?: any }) {
  const response = await remoteServiceApi.getUserDevProjects();
  if ('status' in response) {
    if (response.status === 401) {
      return authSession.refresh();
    }
    throw new Error("Unexpected response status: " + response.status);
  }

  const messages = await getMessages();

  return (
    <div className="w-full mx-auto sm:max-w-[92rem]">
      <SidebarProvider className="min-h-0">
        <NextIntlClientProvider messages={pick(messages, 'DeveloperSidebar', 'DevSidebarContextSwitcher', 'DevSidebarUser')}>
          <DeveloperSidebar profile={response.profile} logoutAction={async () => {
            "use server"
            authSession.logout();
          }}/>
        </NextIntlClientProvider>
        <SidebarInset className="px-1 sm:px-4 my-4 mx-auto min-h-0 w-full">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}