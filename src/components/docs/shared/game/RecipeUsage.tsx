import UsageContentList from "@/components/docs/shared/game/UsageContentList";
import PageLink from "@/components/docs/PageLink";
import {getContentLink} from "@/lib/game/content";
import Asset from "@/components/docs/shared/Asset";
import service from "@/lib/service";
import {getProjectParams} from "@/lib/utils";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";

export default async function RecipeUsage({id}: { id: string }) {
  const params = getProjectParams();
  const project = params.slug;

  const usage = await service.getContentRecipeUsage(project, id, params.version, params.locale);
  if (!usage) {
    return null;
  }

  const sorted = usage.sort((a, b) => a.name && b.name ? a.name.localeCompare(b.name) : 0);
  const rendered = sorted.map(item => (
    <li key={item.id} className="first:mt-0">
      {item.has_page
        ?
        <PageLink href={getContentLink(params as any, item.id)} className="flex flex-row items-center">
          <Asset project={item.project} location={item.id} className="mr-1.5!"/>
          <span>{item.name || item.id}</span>
        </PageLink>
        :
        <div className="flex flex-row items-center">
          <Asset project={item.project} location={item.id} className="mr-1.5!"/>
          <span>{item.name || item.id}</span>
        </div>
      }
    </li>
  ));

  return (
    <div className="flex flex-col gap-3">
      <span>
        Can be used to create the following items:
      </span>

      <div className="columns-[20em]">
        <ClientLocaleProvider keys={['UsageContentList']}>
          <UsageContentList limit={12} content={rendered}/>
        </ClientLocaleProvider>
      </div>
    </div>
  )
}