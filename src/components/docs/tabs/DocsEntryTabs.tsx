'use client'

import {useQueryState} from "nuqs";
import {HistoryIcon, HomeIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";

export default function DocsEntryTabs() {
  const [tab, setTab] = useQueryState('tab');
  const t = useTranslations('DocsEntryTabs');

  const switchTab = async (newTab: string) => {
    await setTab(newTab);
    window.scrollTo(0, 0);
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      {tab === 'history'
        ?
        <Button title={t('home')} variant="ghost" size="icon" className="size-8" onClick={() => switchTab('home')}>
          <HomeIcon className="size-4"/>
        </Button>
        :
        <Button title={t('history')} variant="ghost" size="icon" className="size-8" onClick={() => switchTab('history')}>
          <HistoryIcon className="size-4"/>
        </Button>
      }
    </div>
  );
}