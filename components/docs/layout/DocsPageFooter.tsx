'use client'

import {Edit, FlagIcon} from 'lucide-react'
import Link from "next/link"
import * as React from "react";
import {useTranslations} from "next-intl";
import localPreview from "@/lib/previewer/localPreview";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

interface FooterProps {
  slug?: string;
  path?: string[];
  editUrl?: string;
  local?: boolean;
}

function ReportPage({local, slug, path}: { local?: boolean; slug?: string; path?: string[]; }) {
  const preview = localPreview.isEnabled();
  const t = useTranslations('PageEditControls');

  return !preview && !local && slug && path && (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="outline" size="sm"
                  className="sm:p-0 text-secondary hover:bg-transparent sm:h-fit font-normal sm:border-none">
            <Link href={`/report?slug=${slug}&path=${path.join('/')}`}>
              <FlagIcon className="w-4 h-4 mr-2 sm:mr-0"/>
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

function EditPage({editUrl} : { editUrl?: string }) {
  const t = useTranslations('PageEditControls');

  return editUrl && (
    <Link href={editUrl}
          className="flex items-center px-3 py-2 sm:p-0 rounded-md border border-quaternary sm:border-none hover:text-primary-alt">
      <Edit className="w-4 h-4 mr-2"/>
      {t('edit_gh')}
    </Link>
  )
}

function DesktopDocsFooter({
                             slug,
                             path,
                             editUrl,
                             local
                           }: FooterProps) {
  return (
    <>
      <div className="hidden sm:flex flex-nowrap flex-row items-center justify-start gap-4">
        <ReportPage local={local} slug={slug} path={path}/>
      </div>

      <div className="hidden sm:flex flex-nowrap flex-row items-center justify-start gap-4">
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-y-3 sm:gap-y-0 sm:gap-x-4">
          <EditPage editUrl={editUrl} />
        </div>
      </div>
    </>
  )
}

function MobileDocsFooter({local, slug, path, editUrl}: FooterProps) {
  return (
    <div className="sm:hidden flex flex-col gap-3">
      <div className="flex flex-row flex-wrap justify-between gap-2">
        <ReportPage local={local} slug={slug} path={path}/>
        <EditPage editUrl={editUrl} />
      </div>
    </div>
  );
}

export default function DocsPageFooter(props: FooterProps) {
  return (
    <footer className="border-t border-border px-1 sm:px-4 py-3 flex flex-col-reverse sm:flex-row gap-y-3 sm:gap-y-0 sm:items-center
                      justify-between text-sm text-secondary relative
                      shrink-0 bg-primary sm:h-16">
      <DesktopDocsFooter {...props} />
      <MobileDocsFooter {...props} />
    </footer>
  )
}