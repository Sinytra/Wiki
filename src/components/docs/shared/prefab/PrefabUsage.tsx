import {getProjectContentParams} from "@/lib/utils";
import LinkAwareHeading from "@/components/docs/LinkAwareHeading";
import {getTranslations} from "next-intl/server";
import RecipeUsage from "@/components/docs/shared/game/RecipeUsage";

export default async function PrefabUsage() {
  const params = getProjectContentParams();
  const t = await getTranslations('PrefabUsage');

  return (
    <div>
      <LinkAwareHeading>
        {t('usage')}
      </LinkAwareHeading>

      <RecipeUsage id={params.id} />
    </div>
  )
}