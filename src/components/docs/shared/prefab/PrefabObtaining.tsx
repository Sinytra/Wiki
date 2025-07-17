import service from "@/lib/service";
import ResolvedProjectRecipe from "@/components/docs/shared/game/ResolvedProjectRecipe";
import LinkAwareHeading from "@/components/docs/LinkAwareHeading";
import {getTranslations} from "next-intl/server";
import {ProjectContentContext, ProjectContext} from "@repo/shared/types/service";

export default async function PrefabObtaining(ctx: ProjectContext | ProjectContentContext) {
  return 'contentId' in ctx ? BoundPrefabObtaining({ctx}) : null;
}

async function BoundPrefabObtaining({ctx}: {ctx: ProjectContentContext}) {
  const t = await getTranslations('PrefabObtaining');

  const recipes = await service.getContentRecipeObtaining(ctx.contentId, ctx);
  // TODO Handle no recipes
  if (!recipes || recipes.length === 0) {
    return null;
  }

  return (
    <div>
      <LinkAwareHeading>
        {t('recipe')}
      </LinkAwareHeading>

      {recipes.map(recipe => (
        <div key={recipe.id}>
          <ResolvedProjectRecipe recipe={recipe} ctx={ctx} />
        </div>
      ))}
    </div>
  )
}