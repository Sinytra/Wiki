import RotatingItemDisplaySlot from "@/components/docs/shared/game/RotatingItemDisplaySlot";
import {ResolvedItem} from "@/lib/service/types";
import {ContentRouteParams, getResolvedItemLink} from "@/lib/game/content";
import {cn} from "@/lib/utils";

export default function RecipeIngredientDisplay({count, item, params}: { count: number; item: ResolvedItem; params: ContentRouteParams }) {
  const href = getResolvedItemLink(params, item);
  const ContentDiv: any = href != null ? 'a' : 'div';

  return (
    <div className="inline-flex items-center">
      <span>{count}x</span>
      <ContentDiv href={href} target="_blank">
        <div className="inline-block mx-1">
          <RotatingItemDisplaySlot noTooltip noLink src={[item]}/>
        </div>
        <span className={cn('text-primary-alt font-medium', href && 'underline')}>{item.name}</span>
      </ContentDiv>
    </div>
  )
}