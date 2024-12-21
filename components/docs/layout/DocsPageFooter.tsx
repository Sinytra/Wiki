'use client'

import {Clock, Edit} from 'lucide-react'
import Link from "next/link"
import DocsLanguageSelect from "@/components/docs/DocsLanguageSelect";
import DocsVersionSelector from "@/components/docs/versions/DocsVersionSelector";
import * as React from "react";
import {useTranslations} from "next-intl";
import LocalDateTime from "@/components/util/LocalDateTime";
import DocsEntryTabs from "@/components/docs/tabs/DocsEntryTabs";

interface FooterProps {
  locale: string
  version: string
  locales?: string[];
  versions?: Record<string, string>
  editUrl?: string;
  updatedAt?: Date;
  showHistory?: boolean;
}

export default function Footer({locale, version, locales, versions, editUrl, updatedAt, showHistory}: FooterProps) {
  const t = useTranslations('PageEditControls');

  return (
    <footer className="border-t border-border px-4 py-3 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center
                      justify-between text-sm text-muted-foreground relative
                      flex-shrink-0 sm:sticky sm:bottom-0 bg-background h-16">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        {updatedAt &&
          <span className="flex items-center text-muted-foreground text-sm whitespace-pre">
            <Clock className="w-4 h-4 mr-2"/>
            {t.rich('last_updated', {date: (chunks) => <LocalDateTime dateTime={updatedAt}/>})}
          </span>
        }
      </div>

        {showHistory &&
          <div className="ml-auto mr-4 md:absolute md:left-1/2 md:-translate-x-1/2">
            <DocsEntryTabs/>
          </div>
        }
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        {locales && locales.length > 0 &&
          <DocsLanguageSelect locale={locale} locales={locales}/>
        }
        {versions && Object.keys(versions).length > 0 &&
          <DocsVersionSelector version={version} versions={versions}/>
        }
        {editUrl && <Link href={editUrl} className="flex items-center hover:text-accent-foreground">
            <Edit className="w-4 h-4 mr-2"/>
            Edit this page
        </Link>
        }
      </div>
    </footer>
  )
}