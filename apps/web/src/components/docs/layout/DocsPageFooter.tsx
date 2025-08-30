'use client'

import * as React from "react";
import ReportPageButton from "@/components/docs/layout/ReportPageButton";
import EditPageButton from "@/components/docs/layout/EditPageButton";

interface FooterProps {
  slug: string;
  path?: string[];
  editUrl?: string;
  local?: boolean;
  preview: boolean;
}

function DesktopDocsFooter({slug, path, editUrl, local, preview}: FooterProps) {
  return (
    <div className="flex w-full flex-row justify-between sm:max-w-5xl">
      <div className="hidden flex-row flex-nowrap items-center justify-start gap-4 sm:flex">
        <ReportPageButton local={local} project={slug} path={path} preview={preview}/>
      </div>

      <div className="hidden flex-row flex-nowrap items-center justify-start gap-4 sm:flex">
        <div className="flex flex-col items-end gap-y-3 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-0">
          <EditPageButton editUrl={editUrl}/>
        </div>
      </div>
    </div>
  )
}

function MobileDocsFooter({local, slug, path, editUrl, preview}: FooterProps) {
  return (
    <div className="flex flex-col gap-3 sm:hidden">
      <div className="flex flex-row flex-wrap justify-between gap-2">
        <ReportPageButton local={local} project={slug} path={path} preview={preview}/>
        <EditPageButton editUrl={editUrl}/>
      </div>
    </div>
  );
}

export default function DocsPageFooter(props: FooterProps) {
  return (
    <footer className={`
      relative flex w-full shrink-0 flex-col-reverse justify-between gap-y-3 border-t border-border bg-primary px-1 py-3
      text-sm text-secondary sm:h-16 sm:flex-row sm:items-center sm:justify-center sm:gap-y-0 sm:px-4
    `}>
      <DesktopDocsFooter {...props} />
      <MobileDocsFooter {...props} />
    </footer>
  )
}