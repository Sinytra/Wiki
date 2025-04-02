import {setContextLocale} from "@/lib/locales/routing";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import authSession from "@/lib/authSession";
import {Button} from "@/components/ui/button";
import {SettingsIcon} from "lucide-react";
import ImageWithFallback from "@/components/util/ImageWithFallback";

export default async function DevProjectMembersPage({params}: { params: { locale: string } }) {
  setContextLocale(params.locale);

  const response = await remoteServiceApi.getUserProfile();
  if ('status' in response) {
    if (response.status === 401) {
      return authSession.refresh();
    }
    throw new Error("Unexpected response status: " + response.status);
  }

  return (
    <div className="pt-1 space-y-3">
      <DevProjectPageTitle title="Project members" desc="Manage project members & permissions"/>

      <div className="flex flex-row gap-4 p-4 w-full border border-tertiary rounded-md bg-primary-alt">
        <ImageWithFallback src={response.avatar_url} width={84} height={84} className="rounded-sm" alt="avatar"/>

        <div className="flex flex-col w-full justify-between items-end">
          <div className="flex flex-row gap-2 justify-between w-full">
            <span className="text-xl">{response.username}</span>
            <span className="text-secondary">Owner</span>
          </div>

          <div>
            <Button disabled className="h-8 border border-neutral-700" variant="ghost" size="sm">
              <SettingsIcon className="mr-2 w-4 h-4"/>
              Manage
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}