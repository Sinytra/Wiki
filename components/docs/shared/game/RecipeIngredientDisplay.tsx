import resourceLocation, {DEFAULT_RSLOC_NAMESPACE} from "@/lib/util/resourceLocation";
import RotatingItemDisplaySlot from "@/components/docs/shared/game/RotatingItemDisplaySlot";
import {ResolvedItem} from "@/lib/service/types";

function getWikiLink(id: string): string | null {
  const loc = resourceLocation.parse(id);
  return loc?.namespace === DEFAULT_RSLOC_NAMESPACE ? `https://minecraft.wiki/w/${loc.path}` : null;
}

export default function RecipeIngredientDisplay({count, item}: { count: number; item: ResolvedItem }) {
  const href = getWikiLink(item.id);
  const ContentDiv: any = href != null ? 'a' : 'div';

  return (
    <div className="inline-flex items-center">
      <span>{count}x</span>
      <ContentDiv href={href} target="_blank">
        <div className="inline-block mx-1">
          <RotatingItemDisplaySlot noTooltip src={[item]}/>
        </div>
        <span className="text-primary-alt underline font-medium">{item.name}</span>
      </ContentDiv>
    </div>
  )
}