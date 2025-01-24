'use client'

import {Clock, Edit, FlagIcon} from 'lucide-react'
import Link from "next/link"
import DocsLanguageSelect from "@/components/docs/DocsLanguageSelect";
import DocsVersionSelector from "@/components/docs/versions/DocsVersionSelector";
import * as React from "react";
import {useTranslations} from "next-intl";
import LocalDateTime from "@/components/util/LocalDateTime";
import DocsEntryTabs from "@/components/docs/tabs/DocsEntryTabs";
import localPreview from "@/lib/docs/localPreview";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

interface FooterProps {
  slug?: string;
  path?: string[];
  locale: string;
  version: string;
  locales?: string[];
  versions?: Record<string, string>;
  editUrl?: string;
  updatedAt?: Date;
  showHistory?: boolean;
  local?: boolean;
}

function UpdatedAt({updatedAt}: { updatedAt?: Date }) {
  const t = useTranslations('PageEditControls');

  return updatedAt &&
    <span className="flex items-center text-muted-foreground text-sm whitespace-pre">
        <Clock className="w-4 h-4 mr-2"/>
      {t.rich('last_updated', {date: () => <LocalDateTime dateTime={updatedAt}/>})}
    </span>;
}

function ReportPage({local, slug, path}: { local?: boolean; slug?: string; path?: string[]; }) {
  const preview = localPreview.isEnabled();
  const t = useTranslations('PageEditControls');

  return !preview && !local && slug && path && (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="outline" size="sm"
                  className="sm:p-0 text-muted-foreground hover:bg-transparent sm:h-fit font-normal sm:border-none">
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
          className="flex items-center px-3 py-2 sm:p-0 rounded-md border border-input sm:border-none hover:text-accent-foreground">
      <Edit className="w-4 h-4 mr-2"/>
      {t('edit_gh')}
    </Link>
  )
}

function LanguageSelect({locale, locales} : { locale: string; locales?: string[] }) {
  return locales && locales.length > 0 && (
    <DocsLanguageSelect locale={locale} locales={locales}/>
  )
}

function VersionSelect({version, versions}: { version: string; versions?: Record<string, string>; }) {
  return versions && Object.keys(versions).length > 0 && (
    <DocsVersionSelector version={version} versions={versions}/>
  )
}

function Tabs({showHistory}: { showHistory?: boolean }) {
  return showHistory && (
    <div className="mx-auto sm:ml-auto sm:mr-4 md:absolute md:left-1/2 md:-translate-x-1/2">
      <DocsEntryTabs/>
    </div>
  );
}

function DesktopDocsFooter({
                             slug,
                             path,
                             locale,
                             version,
                             locales,
                             versions,
                             editUrl,
                             updatedAt,
                             showHistory,
                             local
                           }: FooterProps) {
  return (
    <>
      <div className="hidden sm:flex flex-nowrap flex-row items-center justify-start gap-4">
        <ReportPage local={local} slug={slug} path={path}/>
        <UpdatedAt updatedAt={updatedAt}/>
      </div>

      <div className="hidden sm:flex flex-nowrap flex-row items-center justify-start gap-4">
        <Tabs showHistory={showHistory} />

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-y-3 sm:gap-y-0 sm:gap-x-4">
          <LanguageSelect locale={locale} locales={locales}/>
          <VersionSelect version={version} versions={versions} />
          <EditPage editUrl={editUrl} />
        </div>
      </div>
    </>
  )
}

function MobileDocsFooter({local, slug, path, updatedAt, editUrl, locale, locales, version, versions, showHistory}: FooterProps) {
  return (
    <div className="sm:hidden flex flex-col gap-3">
      <Tabs showHistory={showHistory} />
      <LanguageSelect locale={locale} locales={locales}/>
      <VersionSelect version={version} versions={versions} />

      <div className="flex flex-row flex-wrap justify-between gap-2">
        <ReportPage local={local} slug={slug} path={path}/>
        <EditPage editUrl={editUrl} />
      </div>

      <UpdatedAt updatedAt={updatedAt}/>
    </div>
  );
}

export default function DocsPageFooter(props: FooterProps) {
  return (
    <footer className="border-t border-border px-1 sm:px-4 py-3 flex flex-col-reverse sm:flex-row gap-y-3 sm:gap-y-0 sm:items-center
                      justify-between text-sm text-muted-foreground relative
                      shrink-0 bg-background sm:h-16">
      <DesktopDocsFooter {...props} />
      <MobileDocsFooter {...props} />
    </footer>
  )
}