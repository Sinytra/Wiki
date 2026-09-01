'use client';

import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/select';
import { cn } from '@repo/ui/lib/utils';
import { InfoboxTab } from '@sinytra/wiki-api-types';
import commonService from '@/lib/service/commonService';
import { ProjectContext } from '@repo/shared/types/service';

const MAX_TABS_LIST_HEIGHT = 128; // h-32

// language=JavaScript
const COLLAPSE_INIT_SCRIPT = `
(function() {
  const script = document.currentScript;

  const root = script?.parentElement;
  const list = root?.querySelector('[data-tabs-list]');
  if (!root || !list) {
    return;
  }

  const collapsed = list.scrollHeight > ${MAX_TABS_LIST_HEIGHT};

  root.toggleAttribute('data-collapsed', collapsed);
  list.toggleAttribute('inert', collapsed);
})();
`;

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
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('0');

  const selectedTab = tabs[Number(value)];

  useLayoutEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    if (!root || !list) {
      return;
    }

    const updateCollapsedState = () => {
      const collapsed = list.scrollHeight > MAX_TABS_LIST_HEIGHT;

      root.toggleAttribute('data-collapsed', collapsed);
      list.toggleAttribute('inert', collapsed);
    };

    updateCollapsedState();

    const observer = new ResizeObserver(() => updateCollapsedState());
    observer.observe(list);

    return () => observer.disconnect();
  }, []);

  return (
    <Tabs value={value} onValueChange={setValue}>
      <div ref={rootRef} className="group/tabs" suppressHydrationWarning>
        <div className="group-data-collapsed/tabs:h-0 group-data-collapsed/tabs:overflow-hidden">
          <TabsList
            ref={listRef}
            data-tabs-list
            suppressHydrationWarning
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

        <script>{COLLAPSE_INIT_SCRIPT}</script>

        <div className="hidden group-data-collapsed/tabs:block">
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger
              centered
              className="h-8 w-full rounded-sm border-none bg-transparent py-0 hover:bg-secondary [&>span]:text-xsm"
            >
              <SelectValue>
                {selectedTab && (
                  <>
                    <TabIcon tab={selectedTab} ctx={ctx} /> {selectedTab.name}
                  </>
                )}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {tabs.map((tab, i) => (
                <SelectItem key={i} value={i.toString()} className="py-1 [&>span]:text-xsm">
                  <TabIcon tab={tab} ctx={ctx} /> {tab.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <hr className="my-1" />

      {children}
    </Tabs>
  );
}
