import CurseForgeIcon from "@repo/ui/icons/CurseForgeIcon";
import {cn} from "@repo/ui/lib/utils";

export default function CurseForgeColorIcon({ width, height, className}: { width?: any, height?: any, className?: string }) {
  return (
    <CurseForgeIcon className={cn(className, 'text-brand-curseforge')} width={width} height={height} />
  )
}