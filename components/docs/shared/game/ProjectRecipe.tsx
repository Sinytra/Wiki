import {getParams} from "@nimpl/getters/get-params";
import ResolvedProjectRecipe from "@/components/docs/shared/game/ResolvedProjectRecipe";
import service from "@/lib/service";

export default async function ProjectRecipe({id, project}: { id: string; project?: string }) {
  const params = getParams() || {};
  const slug = project || params.slug as any;

  const recipe = await service.getProjectRecipe(slug, id);
  if (!recipe) {
    return null;
  }

  return (
    <ResolvedProjectRecipe project={slug} recipe={recipe} />
  )
}
