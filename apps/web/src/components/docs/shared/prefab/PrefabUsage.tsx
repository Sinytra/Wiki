import LinkAwareHeading from "@/components/docs/LinkAwareHeading";
import {getTranslations} from "next-intl/server";
import RecipeUsage from "@/components/docs/shared/game/RecipeUsage";
import {ProjectContentContext, ProjectContext} from "@repo/shared/types/service";

export default async function PrefabUsage(ctx: ProjectContext) {
  return BoundPrefabUsage({ctx});
}

async function BoundPrefabUsage({ctx}: { ctx: ProjectContext | ProjectContentContext }) {
  const t = await getTranslations('PrefabUsage');

  return (
    <div>
      <LinkAwareHeading>
        {t('usage')}
      </LinkAwareHeading>

      {'contentId' in ctx && <RecipeUsage id={ctx.contentId} ctx={ctx} />}
    </div>
  )
}