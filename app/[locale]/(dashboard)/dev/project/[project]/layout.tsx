import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import DevProjectSidebar from "@/components/dev/navigation/DevProjectSidebar";
import {redirect} from "next/navigation";
import {setContextLocale} from "@/lib/locales/routing";
import platforms from "@/lib/platforms";
import DevProjectSidebarContextProvider from "@/components/dev/navigation/DevProjectSidebarContextProvider";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";

export const dynamic = 'force-dynamic';

export default async function DevLayout({params, children}: {
  params: { locale: string; project: string };
  children?: any
}) {
  setContextLocale(params.locale);

  const project = await remoteServiceApi.getDevProject(params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }
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