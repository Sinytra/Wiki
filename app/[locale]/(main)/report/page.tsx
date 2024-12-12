import ReportDocsPageForm from "@/components/docs/ReportDocsPageForm";
import * as React from "react";
import {Link, setContextLocale} from "@/lib/locales/routing";
import {useMessages, useTranslations} from "next-intl";
import {handleReportProjectForm} from "@/lib/forms/actions";

export default function ReportPage({params, searchParams}: { params: { locale: string }; searchParams: { [key: string]: string | string[] | undefined } }) {
  setContextLocale(params.locale);

  const slug = searchParams.slug as string;
  const path = searchParams.path as string;

  const t = useTranslations('Report');
  const messages = useMessages();

  return (
    <div className="flex flex-row gap-4 w-full justify-center page-wrapper-ext">
      <div className="w-full max-w-[62rem] flex flex-col gap-4">
        <h1 className="text-center text-2xl text-primary border-b pb-4">
          {t('title')}
        </h1>

        <div className="my-2">
          {t('desc')}
          <p className="mt-4"/>
          {t.rich('contact', { b: (chunks) => (<b>{chunks}</b>)})}
          &nbsp;{t('confidential')}
          &nbsp;{t.rich('privacy', { link: (chunks) => (<Link className="underline font-medium" href="/about/privacy">{chunks}</Link>) })}
        </div>

        <hr className="my-2" />

        <div className="p-4 bg-muted rounded-md">
          {/*@ts-ignore*/}
          <ReportDocsPageForm projectId={slug} path={path} t={messages['Report']['form']}
                              submitT={messages['SubmitButton']}
                              formAction={handleReportProjectForm.bind(null, slug, path)}/>
        </div>        
      </div>
    </div>
  )
}