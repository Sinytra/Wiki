'use client'

import {Accordion} from "@/components/ui/accordion";
import {usePathname} from "@/lib/locales/routing";

export default function DirectoryTreeViewBase({level, defaultValue, children, open}: { level: number; defaultValue: string; open?: boolean; children: any }) {
  const currentPath = usePathname().split('/').slice(4).join('/');
  const isOpen = open || (currentPath.length > 0 && currentPath.startsWith(defaultValue.substring(1) + '/'));
  const actualValue = isOpen ? [defaultValue] : [];

  return (
    <Accordion className="[&:not(:last-child)_.docsAccordeonTrigger]:border-b" defaultValue={actualValue}
                  type="multiple" style={{paddingLeft: `${((level - 1) * 0.4)}rem`}}>
      {children}
    </Accordion>
  )
}