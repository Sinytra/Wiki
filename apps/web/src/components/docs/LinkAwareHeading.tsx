'use client'

import {LinkIcon} from "lucide-react";
import {cn} from "@repo/ui/lib/utils";
import {ComponentPropsWithoutRef} from "react";

type LinkAwareHeadingProps = ComponentPropsWithoutRef<'h2'> & { id?: string };

export default function LinkAwareHeading(props: LinkAwareHeadingProps) {
  const id = props.id;

  return (
    <h2 {...{...props, className: undefined}} className={cn(props.className, 'group')}>
      {props.children}
      {id &&
        <a href={`#${id}`} className={`
          inline-block pl-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:opacity-100
        `}>
            <LinkIcon className="h-5 w-5 text-primary"/>
        </a>
      }
    </h2>
  );
}