import ReportDocsPageForm from "@/components/docs/ReportDocsPageForm";
import * as React from "react";
import {Link, setContextLocale} from "@/lib/locales/routing";

export default function ReportPage({params, searchParams}: { params: { locale: string }; searchParams: { [key: string]: string | string[] | undefined } }) {
  setContextLocale(params.locale);

  const slug = searchParams.slug as string;
  const path = searchParams.path as string;

  return (
    <div className="flex flex-row gap-4 w-full justify-center">
      <div className="w-full max-w-[62rem] flex flex-col gap-4">
        <h1 className="text-center text-2xl text-primary border-b pb-4">Report a documentation page</h1>

        <div className="my-2">
          Report content that violates our Terms of Service or Content Rules.
          <p className="mt-4"/>
          For contact purposes, your <b>username</b> (and email address, if you provide us one) will be included in the report.
          Your privacy is important to us, and this information will always be kept confidential.
          For more information, please refer to our <Link className="underline font-medium" href="/about/privacy">Privacy Policy</Link>.
        </div>

        <hr className="my-2" />

        <div className="p-4 bg-muted rounded-md">
          <ReportDocsPageForm projectId={slug} path={path}/>
        </div>        
      </div>
    </div>
  )
}