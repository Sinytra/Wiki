import remoteService from "@/lib/service/remoteService";
import Asset from "@/components/docs/shared/Asset";
import PageLink from "@/components/docs/PageLink";
import {getContentLink} from "@/lib/game/content";
import {getParams} from "@nimpl/getters/get-params";

export default async function RecipeUsage({id}: { id: string }) {
  const project = 'mffs';
  const usage = await remoteService.getContentRecipeUsage(project, 'mffs:focus_matrix');
  if (!usage) {
    return null;
  }

  const params = getParams() || {};
  const sorted = usage.sort((a, b) => a.name && b.name ? a.name.localeCompare(b.name) : 0);

  return (
    <div className="flex flex-col gap-3">
      <span>
        Can be used to create the following items:
      </span>

      <div className="columns-[20em]">
        <ul className="mt-0">
          {...sorted.map(item => (
            <li key={item.id} className="first:mt-0">
              <PageLink href={getContentLink(params, item.id)}>
                <Asset project={item.project} location={item.id} className="mr-1.5!"/>
                <span>{item.name || item.id}</span>
              </PageLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}