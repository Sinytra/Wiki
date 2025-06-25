import {getProjectContentParams} from "@/lib/utils";
import service from "@/lib/service";
import ResolvedProjectRecipe from "@/components/docs/shared/game/ResolvedProjectRecipe";
import LinkAwareHeading from "@/components/docs/LinkAwareHeading";
import {getTranslations} from "next-intl/server";
import ProjectRecipe from "@/components/docs/shared/game/ProjectRecipe";

export default async function PrefabObtaining() {
  const params = getProjectContentParams();
  const t = await getTranslations('PrefabObtaining');

  const recipes = await service.getContentRecipeObtaining(params.slug, params.version, params.version, params.locale);
  // TODO Handle no recipes
  if (!recipes || recipes.length === 0) {
    return (
      <ProjectRecipe id="mffs:steel_dust" />
    );
  }

  return (
    <div>
      <LinkAwareHeading>
        {t('recipe')}
      </LinkAwareHeading>

      {recipes.map(recipe => (
        <div key={recipe.id}>
          <ResolvedProjectRecipe project={params.slug} recipe={recipe} params={params as any} />
        </div>
      ))}
    </div>
  )
}