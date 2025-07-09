import ResolvedProjectRecipe from "@/components/docs/shared/game/ResolvedProjectRecipe";
import service from "@/lib/service";
import {getProjectParams} from "@/lib/utils";

export default async function ProjectRecipe({id, project}: { id: string; project?: string }) {
  const params = getProjectParams();
  const slug = project || params.slug;
  const ctx = {id: slug, version: params.version, locale: params.locale};

  const recipe = await service.getProjectRecipe(id, ctx);
  if (!recipe) {
    return null;
  }

  return (
    <ResolvedProjectRecipe project={slug} recipe={recipe} params={params as any} />
  )
}
