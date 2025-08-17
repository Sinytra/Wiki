import ResolvedProjectRecipe from "@/components/docs/shared/game/ResolvedProjectRecipe";
import service from "@/lib/service";
import {ProjectContext} from "@repo/shared/types/service";

interface Props {
  id: string;
  ctx: ProjectContext;
}

export default async function ProjectRecipe(ctx: ProjectContext, props: Props) {
  return BoundProjectRecipe({...props, ctx});
}

async function BoundProjectRecipe({id, ctx}: Props) {
  const recipe = await service.getProjectRecipe(id, ctx);
  if (!recipe) {
    return null;
  }

  return (
    <ResolvedProjectRecipe recipe={recipe} ctx={ctx} />
  )
}
