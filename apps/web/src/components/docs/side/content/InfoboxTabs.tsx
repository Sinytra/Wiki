import { InfoboxTab } from '@sinytra/wiki-api-types';
import service from '@/lib/service';
import { ProjectContext } from '@repo/shared/types/service';
import ImageWithFallback from '@/components/util/ImageWithFallback';
import { TabsContent } from '@repo/ui/components/tabs';
import InfoboxTabsSwitcher from './InfoboxTabsSwitcher';

export interface Props {
  tabs: InfoboxTab[];
  ctx: ProjectContext;
}

async function TabDisplayAsset({ id, ctx }: { id: string; ctx: ProjectContext }) {
  const icon = await service.getAsset(id, ctx);

  return (
    <ImageWithFallback
      src={icon?.src}
      width={128}
      height={128}
      className="docsContentIcon disable-blur mx-auto"
      alt={!icon ? undefined : icon.id}
    />
  );
}

function TabDisplay({ tab, ctx }: { tab: InfoboxTab; ctx: ProjectContext }) {
  return (
    <div className="my-2 p-4 text-center">
      {tab.display.map((id) => (
        <TabDisplayAsset key={id} id={id} ctx={ctx} />
      ))}
    </div>
  );
}

export default function InfoboxTabs({ tabs, ctx }: Props) {
  if (tabs?.[0] && tabs.length === 1) {
    return <TabDisplay tab={tabs[0]} ctx={ctx} />;
  }

  return (
    <div className="flex flex-col">
      <InfoboxTabsSwitcher tabs={tabs} ctx={ctx}>
        {tabs.map((tab, i) => (
          <TabsContent key={i} value={i.toString()}>
            <TabDisplay tab={tab} ctx={ctx} />
          </TabsContent>
        ))}
      </InfoboxTabsSwitcher>
    </div>
  );
}
