import {ReactNode} from "react";
import {cn} from "@/lib/utils";

export default function MetadataGrid({className, children}: { className?: string, children?: ReactNode }) {
  return (
    <div className={cn(className, "w-full grid grid-flow-row space-y-3 text-sm")}>
      {children}
    </div>
  )
}