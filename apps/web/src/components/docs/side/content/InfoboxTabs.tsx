import {InfoboxTab} from '@sinytra/wiki-api-types';
import service from '@/lib/service';
import {ProjectContext} from '@repo/shared/types/service';
import ImageWithFallback from '@/components/util/ImageWithFallback';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@repo/ui/components/tabs';

export interface Props {
  tabs: InfoboxTab[];
  ctx: ProjectContext;
}

async function TabDisplayAsset({id, ctx}: { id: string; ctx: ProjectContext; }) {
  const icon = await service.getAsset(id, ctx);

  return (
    <ImageWithFallback src={icon?.src} width={128} height={128}
                       className="docsContentIcon disable-blur mx-auto"
                       alt={!icon ? undefined : icon.id}/>
  );
}

function TabDisplay({tab, ctx}: { tab: InfoboxTab; ctx: ProjectContext; }) {
  return (
    <div className="my-2 p-4">
      {tab.display.map(id => (
        <TabDisplayAsset key={id} id={id} ctx={ctx}/>
      ))}
    </div>
  );
}

export default function InfoboxTabs({tabs, ctx}: Props) {
  if (tabs?.[0] && tabs.length === 1) {
    return (
      <TabDisplay tab={tabs[0]} ctx={ctx} />
    );
  }

  return (
    <div className="flex flex-col">
      <Tabs defaultValue={tabs[0]!.name}>
        <TabsList className="flex h-auto flex-wrap bg-transparent">
          {tabs.map((tab, i) => (
            <TabsTrigger key={i} value={tab.name} className={`
              h-fit rounded-none border-b-2 border-transparent bg-transparent text-xsm hover:text-primary
              data-[state=active]:border-white data-[state=active]:bg-transparent
            `}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <hr className="my-1" />

        {tabs.map((tab, i) => (
          <TabsContent key={i} value={tab.name}>
            <TabDisplay tab={tab} ctx={ctx} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 