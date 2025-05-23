import {getProjectContentParams} from "@/lib/utils";
import service from "@/lib/service";
import ResolvedProjectRecipe from "@/components/docs/shared/game/ResolvedProjectRecipe";
import LinkAwareHeading from "@/components/docs/LinkAwareHeading";
import {getTranslations} from "next-intl/server";

export default async function PrefabObtaining() {
  const params = getProjectContentParams();
  const t = await getTranslations('PrefabObtaining');

  const recipes = await service.getContentRecipeObtaining(params.slug, params.id, params.version, params.locale);
  if (!recipes) {
    return null;
  }

  return (
    <div>
      <LinkAwareHeading>
        {t('recipe')}
      </LinkAwareHeading>

      {recipes.map(recipe => (
        <div>
          <ResolvedProjectRecipe project={params.slug} recipe={recipe} params={params as any} />
        </div>
      ))}
    </div>
  )
}