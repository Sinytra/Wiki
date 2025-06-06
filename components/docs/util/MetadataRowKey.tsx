import {ReactNode} from "react";

export function IconRow({icon: Icon, children}: { icon?: any, children: any }) {
  return (
    <div className="inline-flex items-center gap-2 whitespace-nowrap">
      {Icon && <Icon className="h-4 w-4"/>}
      <span className="text-sm font-medium text-secondary">{children}</span>
    </div>
  )
}

export default function MetadataRowKey({title, icon, children}: { title: string; icon?: any; children?: ReactNode }) {
  return (
    <div className="inline-flex items-start justify-between">
      <IconRow icon={icon}>{title}</IconRow>

      <div className="text-end text-sm font-normal text-secondary">
        {children}
      </div>
    </div>
  )
}