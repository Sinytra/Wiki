import {setContextLocale} from "@/lib/locales/routing";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import DevProjectSettings from "@/components/dev/project/DevProjectSettings";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {pick} from "lodash";
import {handleDeleteProjectForm, handleEditProjectForm} from "@/lib/forms/actions";

export default async function DevProjectSettingsPage({params}: { params: { locale: string; project: string } }) {
  setContextLocale(params.locale);

  const project = await remoteServiceApi.getDevProject(params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }

  const messages = await getMessages();

  return (
    <div className="h-full pt-1 pb-4">
      <NextIntlClientProvider messages={pick(messages, 'ProjectRegisterForm', 'ProjectSettingsForm', 'ProjectDeleteForm', 'FormActions')}>
        <DevProjectSettings
          project={project}
          formAction={handleEditProjectForm}
          deleteFunc={handleDeleteProjectForm.bind(null, project.id)}
        />
      </NextIntlClientProvider>
    </div>
  );
}