import RotatingItemDisplaySlot from "@/components/docs/shared/game/RotatingItemDisplaySlot";
import {ResolvedItem} from "@/lib/service/types";
import {getResolvedItemLink} from "@/lib/game/content";
import {getParams} from "@nimpl/getters/get-params";

export default function RecipeIngredientDisplay({count, item}: { count: number; item: ResolvedItem }) {
  const params = getParams() || {};
  const href = getResolvedItemLink(params, item);
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