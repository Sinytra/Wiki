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
    <div className="relative group">
      <a href={`#${id}`} className="absolute -left-7 pr-2 opacity-0 hover:opacity-100 group-hover:opacity-100 z-50">
        <LinkIcon className="text-primary w-5 h-5 mt-1.5" />
      </a>
      {Base}
    </div>
  );
}