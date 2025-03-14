import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {pick} from "lodash";
import DevProjectSidebar from "@/components/dev/project/DevProjectSidebar";
import {redirect} from "next/navigation";
import {setContextLocale} from "@/lib/locales/routing";
import platforms from "@/lib/platforms";

export const dynamic = 'force-dynamic';

// TODO Mobile sidebar
export default async function DevLayout({ params, children }: { params: { locale: string; project: string }; children?: any }) {
  setContextLocale(params.locale);

  const project = await remoteServiceApi.getDevProject(params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }
  const platformProject = await platforms.getPlatformProject(project);

  const messages = await getMessages();

  return (
    <div className="w-full mx-auto sm:max-w-[92rem]">
      <SidebarProvider className="min-h-0">
        <NextIntlClientProvider messages={pick(messages, 'DevProjectSidebar')}>
          <DevProjectSidebar project={project} platformProject={platformProject} />
        </NextIntlClientProvider>
        <SidebarInset className="px-1 sm:px-4 my-4 mx-auto min-h-0 w-full">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}