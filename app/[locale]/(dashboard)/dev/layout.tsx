import {AppSidebar} from "@/components/dev/new/AppSidebar";
import {auth, signOut} from "@/lib/auth";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";

export default async function DevLayout({ children }: { children?: any }) {
  const session = (await auth())!;

  const response = await remoteServiceApi.getUserDevProjects(session.access_token);
  if ('status' in response) {
    if (response.status === 401) {
      return redirect('/api/auth/refresh');
    }
    throw new Error("Unexpected response status: " + response.status);
  }

  return (
    <div className="w-full mx-auto max-w-[77vw]">
      <SidebarProvider>
        <AppSidebar profile={response.profile} logoutAction={async () => {
          "use server"
          await signOut({redirectTo: '/'});
        }}/>
        <SidebarInset className="pl-4 my-4 mx-auto w-full h-full">
          <div className="sm:hidden">
            <SidebarTrigger className="-ml-1"/>
          </div>

          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}