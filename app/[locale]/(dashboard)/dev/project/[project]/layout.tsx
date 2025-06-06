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
      <div className="w-full mx-auto sm:max-w-[92rem]">
        <SidebarProvider className="min-h-0">
          <ClientLocaleProvider keys={['DevProjectSidebar']}>
            <DevProjectSidebar project={project} platformProject={platformProject}/>
          </ClientLocaleProvider>
          <SidebarInset className="px-1 sm:px-4 my-4 mx-auto min-h-0 w-full">
            {children}
          </SidebarInset>
        </SidebarProvider>
      </div>
    </DevProjectSidebarContextProvider>
  );
}