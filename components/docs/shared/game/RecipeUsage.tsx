import {getParams} from "@nimpl/getters/get-params";
import UsageContentList from "@/components/docs/shared/game/UsageContentList";
import PageLink from "@/components/docs/PageLink";
import {getContentLink} from "@/lib/game/content";
import Asset from "@/components/docs/shared/Asset";
import service from "@/lib/service";

export default async function RecipeUsage({id}: { id: string }) {
  const params = getParams() || {};
  const project = params.slug as any;

  const usage = await service.getContentRecipeUsage(project, id);
  if (!usage) {
    return null;
  }

  const sorted = usage.sort((a, b) => a.name && b.name ? a.name.localeCompare(b.name) : 0);
  const rendered = sorted.map(item => (
    <li key={item.id} className="first:mt-0">
      {item.has_page
        ?
        <PageLink href={getContentLink(params as any, item.id)}>
          <Asset project={item.project} location={item.id} className="mr-1.5!"/>
          <span>{item.name || item.id}</span>
        </PageLink>
        :
        <div>
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
        <UsageContentList limit={12} content={rendered} />
      </div>
    </div>
  )
}