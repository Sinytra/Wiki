import {NextIntlClientProvider} from "next-intl";
import {pick} from "lodash";
import DevProjectLogs from "@/components/dev/DevProjectLogs";
import {ProjectStatus} from "@/lib/types/serviceTypes";
import {fetchProjectLog} from "@/lib/forms/actions";
import {getMessages} from "next-intl/server";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import {setContextLocale} from "@/lib/locales/routing";
import {ActivityIcon} from "lucide-react";

export default async function ProjectHealthPage({params}: { params: { locale: string; project: string } }) {
  setContextLocale(params.locale);

  const project = await remoteServiceApi.getDevProject(params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }

  const messages = await getMessages();

  return (
    <div>
      <div className="flex flex-row items-center gap-2">
        <ActivityIcon className="w-4 h-4"/>
        <span>
          Project health
        </span>
      </div>
      <hr className="my-4"/>
      <div>
        <NextIntlClientProvider messages={pick(messages, 'DevProjectLogs')}>
          <DevProjectLogs id={project.id} status={project.status || ProjectStatus.UNKNOWN} callback={fetchProjectLog}/>
        </NextIntlClientProvider>
      </div>
    </div>
  )
}