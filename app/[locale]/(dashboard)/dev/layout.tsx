import {DeveloperSidebar} from "@/components/dev/DeveloperSidebar";
import {auth, signOut} from "@/lib/auth";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {pick} from "lodash";

export default async function DevLayout({ children }: { children?: any }) {
  const session = (await auth())!;

  const response = await remoteServiceApi.getUserDevProjects(session.access_token);
  if ('status' in response) {
    if (response.status === 401) {
      return redirect('/api/auth/refresh');
    }
    throw new Error("Unexpected response status: " + response.status);
  }

  const messages = await getMessages();

  return (
    <div className="w-full mx-auto sm:max-w-[77vw]">
      <SidebarProvider>
        <NextIntlClientProvider messages={pick(messages, 'DeveloperSidebar', 'DevSidebarContextSwitcher', 'DevSidebarUser')}>
          <DeveloperSidebar profile={response.profile} logoutAction={async () => {
            "use server"
            await signOut({redirectTo: '/'});
          }}/>
        </NextIntlClientProvider>
        <SidebarInset className="px-1 sm:pl-4 sm:pr-0 my-4 mx-auto w-full h-full">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}