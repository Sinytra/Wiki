import ReportDocsPageForm from "@/components/docs/form/ReportDocsPageForm";
import * as React from "react";
import {Link, setContextLocale} from "@/lib/locales/routing";
import {useTranslations} from "next-intl";
import {handleReportProjectForm} from "@/lib/forms/actions";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";

export default function ReportPage({params, searchParams}: { params: { locale: string }; searchParams: { [key: string]: string | string[] | undefined } }) {
  setContextLocale(params.locale);

  const slug = searchParams.slug as string;
  const path = searchParams.path as string;

  const t = useTranslations('Report');

  return (
    <div className="page-wrapper-ext flex w-full flex-row justify-center gap-4">
      <div className="flex w-full max-w-[62rem] flex-col gap-4">
        <h1 className="border-b pb-4 text-center text-2xl text-primary">
          {t('title')}
        </h1>

        <div className="my-2">
          {t('desc')}
          <p className="mt-4"/>
          {t.rich('contact', { b: (chunks) => (<b>{chunks}</b>)})}
          &nbsp;{t('confidential')}
          &nbsp;{t.rich('privacy', { link: (chunks) => (<Link className="font-medium underline" href="/about/privacy">{chunks}</Link>) })}
        </div>

        <hr className="my-2" />

        <div className="rounded-md bg-primary-alt p-4">
          <ClientLocaleProvider keys={['Report']}>
            <ReportDocsPageForm projectId={slug} path={path}
                                formAction={handleReportProjectForm.bind(null, slug, path)}/>
          </ClientLocaleProvider>
        </div>        
      </div>
    </div>
  )
}