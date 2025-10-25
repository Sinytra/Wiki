import ProjectReportForm from "@/components/docs/form/ProjectReportForm";
import * as React from "react";
import {Link, setContextLocale} from "@/lib/locales/routing";
import {useTranslations} from "next-intl";
import {handleReportProjectForm} from "@/lib/forms/actions";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import LinkTextButton from "@/components/navigation/link/LinkTextButton";
import {ProjectReportType} from "@repo/shared/types/api/moderation";
import {notFound} from "next/navigation";
import locales from "@repo/shared/locales";
import {use} from "react";
import commonNetwork from "@repo/shared/commonNetwork";

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function ReportPage(props: { params: Params; searchParams: SearchParams }) {
  const params = use(props.params);
  const searchParams = use(props.searchParams);
  setContextLocale(params.locale);

  const project = searchParams.project as string;
  const type = searchParams.type as ProjectReportType;
  const path = searchParams.path as string | null;
  const locale = searchParams.locale as string || null;
  const version = searchParams.version as string || null;

  if (!type || !project) {
    notFound();
  }

  const t = useTranslations('Report');

  return (
    <div className="page-wrapper-ext flex w-full flex-row justify-center gap-4">
      <div className="flex w-full max-w-[62rem] flex-col gap-4">
        <h1 className="border-b border-secondary pb-4 text-center text-2xl text-primary">
          {t('title')}
        </h1>

        <div className="my-2">
          {t.rich('desc', {
            tos: (chunks: any) => (
              <LinkTextButton className="text-base font-normal! underline" href="/about/tos">
                {chunks}
              </LinkTextButton>
            ),
            cr: (chunks: any) => (
              <LinkTextButton className="text-base font-normal! underline" href="/about/tos#content-rules">
                {chunks}
              </LinkTextButton>
            )
          })}
        </div>

        <div className="rounded-md bg-primary-alt p-4">
          <ClientLocaleProvider keys={['Report', 'ProjectReportReason', 'ProjectReportType']}>
            <ProjectReportForm projectId={project} type={type} path={path}
                               locale={locales.actualLocale(locale)} version={commonNetwork.actualVersion(version)}
                               formAction={handleReportProjectForm}/>
          </ClientLocaleProvider>
        </div>

        <div>
          <span className="text-sm text-secondary">
            {t.rich('contact', {b: (chunks: any) => <span className="font-medium">{chunks}</span>})}
            &nbsp;{t('confidential')}
            &nbsp;{t.rich('privacy', {
            link: (chunks: any) => (<Link className="font-medium underline" href="/about/privacy">{chunks}</Link>)
          })}
          </span>
        </div>
      </div>
    </div>
  )
}