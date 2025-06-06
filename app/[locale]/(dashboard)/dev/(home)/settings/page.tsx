import authSession from "@/lib/authSession";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Link} from "@/lib/locales/routing";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {format} from "date-fns";
import {Button} from "@/components/ui/button";
import {deleteUserAccount, linkModrinthAccount, unlinkModrinthAccount} from "@/lib/forms/actions";
import {ExternalLinkIcon} from "lucide-react";
import UnlinkMRAccountForm from "@/components/dev/settings/UnlinkMRAccountForm";
import LinkMRAccountForm from "@/components/dev/settings/LinkMRAccountForm";
import {cn} from "@/lib/utils";
import DeleteAccountForm from "@/components/dev/settings/DeleteAccountForm";
import {useTranslations} from "next-intl";
import {getTranslations} from "next-intl/server";
import {UserProfile, UserRole} from "@/lib/service/types";
import AdminBadge from "@/components/util/AdminBadge";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";

export const dynamic = 'force-dynamic';

function UserProfileInfo({user}: { user: UserProfile }) {
  const t = useTranslations('UserSettings.profile');
  const joinDate = format(new Date(user.created_at), 'MMMM d, yyyy');

  return (
    <div className="flex flex-row bg-primary-alt rounded-sm w-full p-4 border border-tertiary gap-4">
      <div>
        <img src={user.avatar_url} width={84} height={84} className="rounded-sm" alt="avatar"/>
      </div>

      <div className="flex flex-col gap-2 justify-between w-full">
        <div className="flex flex-row justify-between items-center">
          <span className="text-primary-alt text-lg">
            {user.username}
          </span>
          {user.role === UserRole.ADMIN &&
            <AdminBadge />
          }
        </div>
        <div className="flex justify-between text-secondary text-sm">
          <span>{t('bio')}</span>
          <span>{t('join_date', {date: joinDate})}</span>
        </div>
      </div>
    </div>
  )
}

function UserSettingsCategory({title, className, children}: { title: string; className?: string; children?: any }) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="text-lg text-primary-alt">
        {title}
      </div>
      <div className="px-2 flex flex-col gap-2">
        {children}
      </div>
    </div>
  )
}

function UserSettingsRow({title, desc, children}: { title: string; desc: string; children?: any }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2">
      <div className="flex flex-col gap-1">
        <span>{title}</span>
        <span className="text-secondary text-sm">
          {desc}
        </span>
      </div>
      <div className="ml-auto sm:ml-0">
        {children}
      </div>
    </div>
  )
}

function UserSettings({user}: { user: UserProfile }) {
  const t = useTranslations('UserSettings');

  return (
    <ClientLocaleProvider keys={['UserSettings']}>
      <div className="h-full flex flex-col gap-4">
        <UserSettingsCategory title={t('connections.title')}>
          <UserSettingsRow title={t('connections.modrinth.title')} desc={t('connections.modrinth.desc')}>
            {user.modrinth_id
              ?
              <div className="flex flex-row gap-2">
                <a href={`https://modrinth.com/user/${user.modrinth_id}`} target="_blank">
                  <Button variant="secondary" size="sm" className="font-semibold bg-primary border border-primary">
                    {t('connections.modrinth.view')}
                    <ExternalLinkIcon className="w-4 h-4 ml-2"/>
                  </Button>
                </a>
                <UnlinkMRAccountForm callback={unlinkModrinthAccount}/>
              </div>
              :
              <LinkMRAccountForm callback={linkModrinthAccount}/>
            }
          </UserSettingsRow>
        </UserSettingsCategory>
        <hr className="mt-auto"/>
        <UserSettingsCategory title={t('account.title')}>
          <UserSettingsRow title={t('account.delete.title')} desc={t('account.delete.desc')}>
            <DeleteAccountForm action={deleteUserAccount}/>
          </UserSettingsRow>
        </UserSettingsCategory>
      </div>
    </ClientLocaleProvider>
  );
}

export default async function DevSettingsPage() {
  const response = await remoteServiceApi.getUserProfile();
  if ('status' in response) {
    if (response.status === 401) {
      return authSession.refresh();
    }
    throw new Error("Unexpected response status: " + response.status);
  }

  const t = await getTranslations('UserSettings');

  return (
    <div className="flex flex-col h-full">
      <Breadcrumb className="mt-1 sm:mt-0 mb-4">
        <BreadcrumbList>
          <SidebarTrigger className="-ml-1 mr-1 sm:hidden text-primary"/>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dev">
                {t('breadcrumbs.home')}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator/>
          <BreadcrumbItem>
            <BreadcrumbPage>
              {t('breadcrumbs.settings')}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 h-full flex-auto pb-4">
        <UserProfileInfo user={response}/>

        <hr/>

        <UserSettings user={response}/>
      </div>
    </div>
  )
}