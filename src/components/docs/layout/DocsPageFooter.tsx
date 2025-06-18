'use client'

import {Edit, FlagIcon} from 'lucide-react'
import Link from "next/link"
import * as React from "react";
import {useTranslations} from "next-intl";
import {Button} from "@repo/ui/components/button";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@repo/ui/components/tooltip";

interface FooterProps {
  slug?: string;
  path?: string[];
  editUrl?: string;
  local?: boolean;
  preview: boolean;
}

function ReportPage({local, slug, path, preview}: {
  local?: boolean;
  slug?: string;
  path?: string[];
  preview: boolean;
}) {
  const t = useTranslations('PageEditControls');

  return !preview && !local && slug && path && (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="outline" size="sm"
                  className="text-secondary font-normal hover:bg-transparent sm:h-fit sm:border-none sm:p-0">
            <Link href={`/report?slug=${slug}&path=${path.join('/')}`}>
              <FlagIcon className="mr-2 h-4 w-4 sm:mr-0"/>
              <span className="sm:hidden">
                {t('report_button')}
              </span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {t('report')}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function EditPage({editUrl}: { editUrl?: string }) {
  const t = useTranslations('PageEditControls');

  return editUrl && (
    <Link href={editUrl}
          className={`
            border-quaternary flex items-center rounded-md border px-3 py-2 hover:text-primary-alt sm:border-none sm:p-0
          `}>
      <Edit className="mr-2 h-4 w-4"/>
      {t('edit_gh')}
    </Link>
  )
}

function DesktopDocsFooter({
                             slug,
                             path,
                             editUrl,
                             local,
                             preview
                           }: FooterProps) {
  return (
    <>
      <div className="hidden flex-row flex-nowrap items-center justify-start gap-4 sm:flex">
        <ReportPage local={local} slug={slug} path={path} preview={preview}/>
      </div>

      <div className="hidden flex-row flex-nowrap items-center justify-start gap-4 sm:flex">
        <div className="flex flex-col items-end gap-y-3 sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-0">
          <EditPage editUrl={editUrl}/>
        </div>
      </div>
    </>
  )
}

function MobileDocsFooter({local, slug, path, editUrl, preview}: FooterProps) {
  return (
    <div className="flex flex-col gap-3 sm:hidden">
      <div className="flex flex-row flex-wrap justify-between gap-2">
        <ReportPage local={local} slug={slug} path={path} preview={preview}/>
        <EditPage editUrl={editUrl}/>
      </div>
    </div>
  );
}

export default function DocsPageFooter(props: FooterProps) {
  return (
    <footer className={`
      border-border bg-primary text-secondary relative flex w-full shrink-0 flex-col-reverse justify-between gap-y-3
      border-t px-1 py-3 text-sm sm:h-16 sm:flex-row sm:items-center sm:gap-y-0 sm:px-4
    `}>
      <DesktopDocsFooter {...props} />
      <MobileDocsFooter {...props} />
    </footer>
  )
}