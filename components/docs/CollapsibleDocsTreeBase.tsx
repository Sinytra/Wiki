'use client'

import {useLayoutEffect, useState} from "react";
import DocsSidebarTitle from "@/components/docs/layout/DocsSidebarTitle";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {usePathname} from "@/lib/locales/routing";
import {ChevronDownIcon} from "lucide-react";

export default function CollapsibleDocsTreeBase({title, icon: Icon, defaultOpen, children}: {
  title: string;
  icon?: any;
  defaultOpen?: boolean;
  children: any;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [_, setWindowWidth] = useState<number | undefined>(undefined);
  const desktopWindowSize = 768;

  useLayoutEffect(() => {
    if (window.innerWidth < desktopWindowSize) {
      setIsOpen(false);
    }

    function updateSize() {
      setWindowWidth(state => {
        if (state) {
          if (state < desktopWindowSize && window.innerWidth >= desktopWindowSize) {
            setIsOpen(true);
          } else if (state >= desktopWindowSize && window.innerWidth < desktopWindowSize) {
            setIsOpen(defaultOpen === undefined || defaultOpen);
          }
        }
        return window.innerWidth;
      });
    }

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, [pathname]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}
                 className="h-full flex flex-col px-2 [&[data-state=open]_.docsMainTrigger]:rotate-180">
      <CollapsibleTrigger className="md:hidden">
        <DocsSidebarTitle offset noSeparator extra={
          <ChevronDownIcon
            className="docsMainTrigger md:hidden w-5 h-5 text-secondary transition-transform duration-200"/>
        }>
          {Icon && <Icon className="size-4 mr-2"/>}
          <span className="text-base">{title}</span>
        </DocsSidebarTitle>
      </CollapsibleTrigger>
      <div className="hidden md:block">
        <DocsSidebarTitle offset noSeparator extra={
          <ChevronDownIcon
            className="docsMainTrigger md:hidden w-5 h-5 text-secondary transition-transform duration-200"/>
        }>
          {Icon && <Icon className="size-4 mr-2"/>}
          <span className="text-lg">{title}</span>
        </DocsSidebarTitle>
      </div>

      <CollapsibleContent
        className="pb-2 overflow-hidden transition-all data-[state=open]:animate-collapsible-down md:data-[state=open]:animate-none data-[state=closed]:animate-collapsible-up md:data-[state=closed]:animate-none md:transition-none md:animate-none">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}