import {ReactNode} from "react";

function IconRow({icon: Icon, children}: { icon?: any, children: any }) {
  return (
    <div className="inline-flex items-center whitespace-nowrap gap-2">
      { Icon && <Icon className="w-4 h-4"/> }
      <span className="font-medium text-foreground">{children}</span>
    </div>
  )
}

export default function MetadataRowKey({ title, icon, children }: { title: string; icon?: any; children?: ReactNode }) {
  return (
    <div className="inline-flex items-start justify-between">
      <IconRow icon={icon}>{title}</IconRow>

      <div className="font-light text-end">
        {children}
      </div>
    </div>
  )
}