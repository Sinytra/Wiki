import {setContextLocale} from "@/lib/locales/routing";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import DataTableDemo from "@/components/dev/content/DataTableDemo";

export default async function ProjectDevContentPage({params}: { params: { locale: string; project: string } }) {
  setContextLocale(params.locale);

  const content = await remoteServiceApi.getDevProjectContentPages(params.project);
  if ('status' in content) {
    return redirect('/dev');
  }

  return (
    <div>
      <DataTableDemo data={content} />
    </div>
  )
}
