'use client'

import {ChevronDownIcon} from "lucide-react";
import * as React from "react";
import {cn} from "@repo/ui/lib/utils";

export default function ToggleChevron({className, active}: {className?: string; active: boolean}) {
  return (
    <ChevronDownIcon className={cn(className, 'shrink-0 transition-transform duration-200 data-[rotate=true]:rotate-180')}
                     data-rotate={active ? 'true' : 'false'}/>
  );
}