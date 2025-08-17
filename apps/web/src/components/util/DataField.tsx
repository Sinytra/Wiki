import {Label} from "@repo/ui/components/label";
import {cn} from "@repo/ui/lib/utils";
import {ExternalLinkIcon} from "lucide-react";
import {CopyButton} from "@repo/ui/components/button/CopyButton";
import * as React from "react";

export default function DataField({title, desc, className, icon: Icon, value, iconClass, href, copiable}: {
  title: string;
  desc?: string;
  className?: string;
  icon?: any;
  value: any;
  iconClass?: string;
  href?: string;
  copiable?: boolean;
}) {
  const Element = href ? 'a' : 'div';
  return (
    <div className="flex w-full min-w-0 flex-col gap-y-3">
      <Label>
        {title}
      </Label>
      <Element href={href} target="_blank" className={cn('relative flex flex-row', className)}>
        {Icon && <Icon className={cn('absolute inset-0 top-1/2 left-3 size-4 -translate-y-1/2', iconClass)}/>}
        <div
          className={cn(`
            h-10 w-full overflow-hidden rounded-md border border-quaternary bg-primary-dim px-3 py-2 pl-9 align-bottom
            text-sm leading-5.5 text-ellipsis whitespace-nowrap
          `,
            Icon && 'pl-9', href && 'underline-offset-4 hover:underline', copiable && 'rounded-r-none')}>
          {value}
        </div>
        {href && <ExternalLinkIcon className="absolute top-1/2 right-3 size-4 -translate-y-1/2"/>}
        {copiable &&
          <CopyButton text={value} showToast className={`
            h-10 w-11 rounded-md rounded-l-none border border-l-0 border-quaternary bg-primary-dim opacity-100
          `} />
        }
      </Element>
      {desc &&
        <p className="text-sm text-secondary">
          {desc}
        </p>
      }
    </div>
  )
}