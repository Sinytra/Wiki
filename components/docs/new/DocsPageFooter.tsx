'use client'

import {Clock, Edit} from 'lucide-react'
import Link from "next/link"
import DocsLanguageSelect from "@/components/docs/new/DocsLanguageSelect";
import DocsVersionSelector from "@/components/docs/new/DocsVersionSelector";
import * as React from "react";
import {useTranslations} from "next-intl";
import LocalDateTime from "@/components/util/LocalDateTime";
import DocsEntryTabs from "@/components/docs/new/tabs/DocsEntryTabs";

interface FooterProps {
  locale: string
  version: string
  locales?: string[];
  versions?: Record<string, string>
  editUrl?: string;
  updatedAt?: Date;
}

export default function Footer({locale, version, locales, versions, editUrl, updatedAt}: FooterProps) {
  const t = useTranslations('PageEditControls');

  return (
    <footer
      className="border-t border-border p-4 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center justify-between text-sm text-muted-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        {/*<button onClick={toggleChangelog} className="flex items-center hover:text-accent-foreground">*/}
        {/*  <History className="w-4 h-4 mr-1"/>*/}
        {/*  {isChangelogOpen ? "View Documentation" : "View Changelog"}*/}
        {/*</button>*/}
        {updatedAt &&
          <span className="flex items-center text-muted-foreground text-sm whitespace-pre">
            <Clock className="w-4 h-4 mr-2"/>
            {t.rich('last_updated', {date: (chunks) => <LocalDateTime dateTime={updatedAt}/>})}
          </span>
        }
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <DocsEntryTabs />
        {locales && locales.length > 0 &&
          <DocsLanguageSelect locale={locale} locales={locales}/>
        }
        {versions && Object.keys(versions).length > 0 &&
          <DocsVersionSelector version={version} versions={versions}/>
        }
        {editUrl && <Link href={editUrl} className="flex items-center hover:text-accent-foreground">
            <Edit className="w-4 h-4 mr-1"/>
              Edit this page
          </Link>
        }
      </div>
    </footer>
  )
}