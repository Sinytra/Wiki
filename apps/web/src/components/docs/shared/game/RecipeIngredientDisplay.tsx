import RotatingItemDisplaySlot from "@/components/docs/shared/game/RotatingItemDisplaySlot";
import {getResolvedItemLink} from "@/lib/game/content";
import {cn} from "@repo/ui/lib/utils";
import {DisplayItem, ProjectContext} from "@repo/shared/types/service";

export default function RecipeIngredientDisplay({tag, count, item, ctx}: { tag: string | null; count: number; item: DisplayItem; ctx: ProjectContext }) {
  const href = getResolvedItemLink(ctx, item);
  const ContentDiv: any = href != null ? 'a' : 'div';

  return (
    <div className="inline-flex items-center">
      <span>{count}x</span>
      <ContentDiv href={href} target="_blank" className="inline-flex items-center">
        <div className="mx-1">
          <RotatingItemDisplaySlot noTooltip noLink src={[item]} tag={tag}/>
        </div>
        <span className={cn('font-medium text-primary-alt', href && 'underline')}>
          {item.name}
        </span>
      </ContentDiv>
    </div>
  )
}