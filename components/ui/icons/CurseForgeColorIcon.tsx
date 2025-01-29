import CurseForgeIcon from "@/components/ui/icons/CurseForgeIcon";
import {cn} from "@/lib/utils";

export default function CurseForgeColorIcon({ width, height, className}: { width?: any, height?: any, className?: string }) {
  return (
    <CurseForgeIcon className={cn(className, 'text-brand-curseforge')} width={width} height={height} />
  )
}