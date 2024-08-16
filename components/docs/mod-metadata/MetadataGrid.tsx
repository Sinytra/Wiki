import {ReactNode} from "react";

export default function MetadataGrid({children}: { children?: ReactNode }) {
  return (
    <div className="w-full grid grid-flow-row gap-y-3 text-sm">
      {children}
    </div>
  )
}