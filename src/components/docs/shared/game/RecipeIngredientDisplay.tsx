import RotatingItemDisplaySlot from "@/components/docs/shared/game/RotatingItemDisplaySlot";
import {ContentRouteParams, getResolvedItemLink} from "@/lib/game/content";
import {cn} from "@repo/ui/lib/utils";
import {ResolvedItem} from "@repo/shared/types/service";

export default function RecipeIngredientDisplay({count, item, params}: { count: number; item: ResolvedItem; params: ContentRouteParams }) {
  const href = getResolvedItemLink(params, item);
  const ContentDiv: any = href != null ? 'a' : 'div';

  return (
    <div className="inline-flex items-center">
      <span>{count}x</span>
      <ContentDiv href={href} target="_blank">
        <div className="mx-1 inline-block">
          <RotatingItemDisplaySlot noTooltip noLink src={[item]}/>
        </div>
        <span className={cn('font-medium text-primary-alt', href && 'underline')}>{item.name}</span>
      </ContentDiv>
    </div>
  )
}