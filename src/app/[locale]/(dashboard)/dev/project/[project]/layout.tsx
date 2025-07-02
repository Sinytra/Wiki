import {SidebarInset, SidebarProvider} from "@repo/ui/components/sidebar";
import DevProjectSidebar from "@/components/dev/navigation/DevProjectSidebar";
import {setContextLocale} from "@/lib/locales/routing";
import platforms from "@repo/platforms";
import DevProjectSidebarContextProvider from "@/components/dev/navigation/DevProjectSidebarContextProvider";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import {handleApiCall} from "@/lib/service/serviceUtil";
import devProjectApi from "@/lib/service/api/devProjectApi";

export const dynamic = 'force-dynamic';

export default async function DevLayout(
  props: {
    params: Promise<{ locale: string; project: string }>;
    children?: any
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  setContextLocale(params.locale);
  const project = handleApiCall(await devProjectApi.getProject(params.project));
  const platformProject = await platforms.getPlatformProject(project);

  return (
    <DevProjectSidebarContextProvider>
      <div className="mx-auto w-full sm:max-w-[92rem]">
        <SidebarProvider className="min-h-0">
          <ClientLocaleProvider keys={['DevProjectSidebar']}>
            <DevProjectSidebar project={project} platformProject={platformProject}/>
          </ClientLocaleProvider>
          <SidebarInset className="mx-auto my-4 min-h-0 w-full px-1 sm:px-4">
            {children}
          </SidebarInset>
        </SidebarProvider>
      </div>
    </DevProjectSidebarContextProvider>
  );
}