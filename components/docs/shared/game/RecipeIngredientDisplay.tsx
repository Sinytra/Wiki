import RotatingItemDisplaySlot from "@/components/docs/shared/game/RotatingItemDisplaySlot";
import {ResolvedItem} from "@/lib/service/types";
import {getExternalWikiLink} from "@/lib/game/content";

export default function RecipeIngredientDisplay({count, item}: { count: number; item: ResolvedItem }) {
  const href = getExternalWikiLink(item.id);
  const ContentDiv: any = href != null ? 'a' : 'div';

  return (
    <div className="inline-flex items-center">
      <span>{count}x</span>
      <ContentDiv href={href} target="_blank">
        <div className="inline-block mx-1">
          <RotatingItemDisplaySlot noTooltip noLink src={[item]}/>
        </div>
        <span className="text-primary-alt underline font-medium">{item.name}</span>
      </ContentDiv>
    </div>
  )
}