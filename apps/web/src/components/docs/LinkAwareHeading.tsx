'use client'

import {LinkIcon} from "lucide-react";

export default function LinkAwareHeading(props: any) {
  const id = props.id;

  const Base = (
    <h2 {...props}>
      {props.children}
    </h2>
  )

  if (!id) {
    return Base;
  }

  return (
    <div className="group relative">
      <a href={`#${id}`} className="absolute -left-7 z-50 pr-2 opacity-0 group-hover:opacity-100 hover:opacity-100">
        <LinkIcon className="mt-1.5 h-5 w-5 text-primary" />
      </a>
      {Base}
    </div>
  );
}