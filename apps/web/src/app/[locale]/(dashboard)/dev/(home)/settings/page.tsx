import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@repo/ui/components/breadcrumb";
import {SidebarTrigger} from "@repo/ui/components/sidebar";
import {setContextLocale} from "@/lib/locales/routing";
import {format} from "date-fns";
import {Button} from "@repo/ui/components/button";
import {deleteUserAccount, linkModrinthAccount, unlinkModrinthAccount} from "@/lib/forms/actions";
import {ExternalLinkIcon} from "lucide-react";
import UnlinkMRAccountForm from "@/components/dashboard/dev/settings/UnlinkMRAccountForm";
import LinkMRAccountForm from "@/components/dashboard/dev/settings/LinkMRAccountForm";
import {cn} from "@repo/ui/lib/utils";
import DeleteAccountForm from "@/components/dashboard/dev/settings/DeleteAccountForm";
import {useTranslations} from "next-intl";
import {getTranslations} from "next-intl/server";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import {handleApiCall} from "@/lib/service/serviceUtil";
import authApi from "@/lib/service/api/authApi";
import {UserProfile, UserRole} from "@repo/shared/types/api/auth";
import AdminBadge from "@repo/ui/components/badge/AdminBadge";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";

export const dynamic = 'force-dynamic';

function UserProfileInfo({user}: { user: UserProfile }) {
  const t = useTranslations('UserSettings.profile');
  const joinDate = format(new Date(user.created_at), 'MMMM d, yyyy');

  return (
    <div className="flex w-full flex-row gap-4 rounded-sm border border-tertiary bg-primary-alt p-4">
      <div>
        <img src={user.avatar_url} width={84} height={84} className="rounded-sm" alt="avatar"/>
      </div>

      <div className="flex w-full flex-col justify-between gap-2">
        <div className="flex flex-row items-center justify-between">
          <span className="text-lg text-primary-alt">
            {user.username}
          </span>
          {user.role === UserRole.ADMIN &&
            <AdminBadge />
          }
        </div>
        <div className="flex justify-between text-sm text-secondary">
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
      <div className="flex flex-col gap-2 px-2">
        {children}
      </div>
    </div>
  )
}

function UserSettingsRow({title, desc, children}: { title: string; desc: string; children?: any }) {
  return (
    <div className="flex flex-col justify-between gap-2 sm:flex-row">
      <div className="flex flex-col gap-1">
        <span>{title}</span>
        <span className="text-sm text-secondary">
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
      <div className="flex h-full flex-col gap-4">
        <UserSettingsCategory title={t('connections.title')}>
          <UserSettingsRow title={t('connections.modrinth.title')} desc={t('connections.modrinth.desc')}>
            {user.modrinth_id
              ?
              <div className="flex flex-row gap-2">
                <a href={`https://modrinth.com/user/${user.modrinth_id}`} target="_blank" rel="noreferrer">
                  <Button variant="secondary" size="sm" className="border border-primary bg-primary font-semibold">
                    {t('connections.modrinth.view')}
                    <ExternalLinkIcon className="ml-2 h-4 w-4"/>
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

export default async function DevSettingsPage(props: { params: Promise<{ locale: string; }> }) {
  const params = await props.params;
  setContextLocale(params.locale);

  const profile = handleApiCall(await authApi.getUserProfile());
  const t = await getTranslations('UserSettings');

  return (
    <div className="flex h-full flex-col">
      <Breadcrumb className="mt-1 mb-4 sm:mt-0">
        <BreadcrumbList>
          <SidebarTrigger className="mr-1 -ml-1 text-primary sm:hidden"/>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <LocaleNavLink href="/dev">
                {t('breadcrumbs.home')}
              </LocaleNavLink>
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

      <div className="flex h-full flex-auto flex-col gap-4 pb-4">
        <UserProfileInfo user={profile}/>

        <hr/>

        <UserSettings user={profile}/>
      </div>
    </div>
  )
}