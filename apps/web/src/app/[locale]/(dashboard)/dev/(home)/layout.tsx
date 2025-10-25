import {DeveloperSidebar} from "@/components/dashboard/dev/navigation/DeveloperSidebar";
import {SidebarInset, SidebarProvider} from "@repo/ui/components/sidebar";
import authSession from "@/lib/authSession";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import {handleApiCall} from "@/lib/service/serviceUtil";
import {setContextLocale} from "@/lib/locales/routing";
import devProjectApi from "@/lib/service/api/devProjectApi";

export const dynamic = 'force-dynamic';

export default async function DevLayout(props: { params: Promise<{ locale: string; }>; children?: any }) {
  const params = await props.params;

  const {
    children
  } = props;

  setContextLocale(params.locale);
  const response = handleApiCall(await devProjectApi.getProjects());

  return (
    <div className="mx-auto w-full sm:max-w-[92rem]">
      <SidebarProvider className="min-h-0">
        <ClientLocaleProvider keys={['DeveloperSidebar', 'DevSidebarContextSwitcher', 'DevSidebarUser']}>
          <DeveloperSidebar profile={response.profile} logoutAction={async () => {
            "use server"
            authSession.logout();
          }}/>
        </ClientLocaleProvider>
        <SidebarInset className="mx-auto my-4 min-h-0 w-full px-1 sm:px-4">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}