'use client'

import {useQueryState} from "nuqs";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {HistoryIcon, HomeIcon} from "lucide-react";

export default function DocsEntryTabs() {
  const [tab, setTab] = useQueryState('tab');

  const switchTab = async (newTab: string) => {
    await setTab(newTab);
    window.scrollTo(0, 0);
  }

  return (
    <Tabs defaultValue="home" value={tab || undefined} onValueChange={switchTab} className="p-0 m-0">
      <TabsList className="h-fit border rounded-xs bg-primary">
        <TabsTrigger className="h-[30px] data-[state=active]:bg-neutral-800" value="home">
          <HomeIcon className="w-4 h-4"/>
        </TabsTrigger>
        <TabsTrigger className="h-[30px] data-[state=active]:bg-neutral-800" value="history">
          <HistoryIcon className="w-4 h-4"/>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}