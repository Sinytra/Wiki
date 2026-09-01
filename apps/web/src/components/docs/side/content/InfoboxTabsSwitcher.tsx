'use client';

import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/select';
import { cn } from '@repo/ui/lib/utils';
import { InfoboxTab } from '@sinytra/wiki-api-types';
import commonService from '@/lib/service/commonService';
import { ProjectContext } from '@repo/shared/types/service';

const MAX_TABS_LIST_HEIGHT = 128; // h-32

export interface Props {
  ctx: ProjectContext;
  tabs: InfoboxTab[];
  children: ReactNode;
}

function TabIcon({ tab, ctx }: { tab: InfoboxTab; ctx: ProjectContext }) {
  if (!tab.display[0]) {
    return null;
  }

  const location = tab.display[0];
  const asset = commonService.getRemoteAsset(location, ctx);
  if (!asset) {
    return null;
  }

  return <img className="mr-1 inline-block" src={asset.src} alt={asset.id} width={24} height={24} />;
}

export default function InfoboxTabsSwitcher({ tabs, ctx, children }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [value, setValue] = useState('0');

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    const observer = new ResizeObserver(() => setCollapsed(list.offsetHeight > MAX_TABS_LIST_HEIGHT));
    observer.observe(list);

    return () => observer.disconnect();
  }, []);

  return (
    <Tabs value={value} onValueChange={setValue}>
      <div className={cn(collapsed && 'invisible h-0 overflow-hidden')}>
        <TabsList
          ref={listRef}
          inert={collapsed}
          aria-hidden={collapsed}
          className="flex h-auto flex-wrap bg-transparent"
        >
          {tabs.map((tab, i) => (
            <TabsTrigger
              key={i}
              value={i.toString()}
              className={cn(
                'h-fit rounded-none border-b-2 border-transparent bg-transparent text-xsm',
                'hover:text-primary data-[state=active]:border-white data-[state=active]:bg-transparent'
              )}
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {collapsed && (
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger
            centered
            className="h-8 w-full rounded-sm border-none bg-transparent py-0 hover:bg-secondary [&>span]:text-xsm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab, i) => (
              <SelectItem key={i} value={i.toString()} className="py-1 [&>span]:text-xsm">
                <TabIcon tab={tab} ctx={ctx} /> {tab.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <hr className="my-1" />

      {children}
    </Tabs>
  );
}
