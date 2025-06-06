import {setContextLocale} from "@/lib/locales/routing";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import authSession from "@/lib/authSession";
import {Button} from "@/components/ui/button";
import {SettingsIcon} from "lucide-react";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import {getTranslations} from "next-intl/server";

export default async function DevProjectMembersPage({params}: { params: { locale: string } }) {
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectMembersPage');

  const response = await remoteServiceApi.getUserProfile();
  if ('status' in response) {
    if (response.status === 401) {
      return authSession.refresh();
    }
    throw new Error("Unexpected response status: " + response.status);
  }

  return (
    <div className="space-y-3 pt-1">
      <DevProjectPageTitle title={t('title')} desc={t('desc')}/>

      <div className="flex w-full flex-row gap-3 rounded-md border border-tertiary bg-primary-alt p-3 sm:gap-4 sm:p-4">
        <ImageWithFallback src={response.avatar_url} width={64} height={64} className="rounded-sm sm:size-21"
                           alt="avatar"/>

        <div className="flex w-full flex-col items-end justify-between">
          <div className="flex w-full flex-row justify-between gap-2">
            <span className="text-lg sm:text-xl">{response.username}</span>
            <span className="text-secondary">{t('roles.owner')}</span>
          </div>

          <div>
            <Button disabled className="h-8 border border-neutral-700" variant="ghost" size="sm">
              <SettingsIcon className="mr-2 h-4 w-4"/>
              {t('actions.manage')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}