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
  locale: string
  version: string
  locales?: string[];
  versions?: Record<string, string>
  editUrl?: string;
  updatedAt?: Date;
  showHistory?: boolean;
  local?: boolean;
}

export default function DocsPageFooter({
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
  const t = useTranslations('PageEditControls');
  const preview = localPreview.isEnabled();

  return (
    <footer className="border-t border-border px-4 py-3 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center
                      justify-between text-sm text-muted-foreground relative
                      flex-shrink-0 bg-background h-16">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        {!preview && local && slug && path &&
          <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger asChild>
                      <Button asChild variant="ghost" size="sm"
                              className="p-0 text-muted-foreground hover:bg-transparent h-fit font-normal">
                          <Link href={`/report?slug=${slug}&path=${path.join('/')}`}>
                              <FlagIcon className="w-4 h-4"/>
                          </Link>
                      </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t('report')}
                  </TooltipContent>
              </Tooltip>
          </TooltipProvider>
        }

        {updatedAt &&
          <span className="flex items-center text-muted-foreground text-sm whitespace-pre">
            <Clock className="w-4 h-4 mr-2"/>
            {t.rich('last_updated', {date: () => <LocalDateTime dateTime={updatedAt}/>})}
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
            {t('edit_gh')}
        </Link>
        }
      </div>
    </footer>
  )
}