'use client'

import {useLayoutEffect, useState} from "react";
import DocsSidebarTitle from "@/components/docs/layout/DocsSidebarTitle";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@repo/ui/components/collapsible";
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
                 className="flex h-full flex-col px-2 sm:min-h-screen [&[data-state=open]_.docsMainTrigger]:rotate-180">
      <CollapsibleTrigger className="md:hidden">
        <DocsSidebarTitle offset noSeparator extra={
          <ChevronDownIcon
            className="docsMainTrigger h-5 w-5 text-secondary transition-transform duration-200 md:hidden"/>
        }>
          {Icon && <Icon className="mr-2 size-4"/>}
          <span className="text-base">{title}</span>
        </DocsSidebarTitle>
      </CollapsibleTrigger>
      <div className="hidden md:block">
        <DocsSidebarTitle offset noSeparator extra={
          <ChevronDownIcon
            className="docsMainTrigger h-5 w-5 text-secondary transition-transform duration-200 md:hidden"/>
        }>
          {Icon && <Icon className="mr-2 size-4"/>}
          <span className="text-lg">{title}</span>
        </DocsSidebarTitle>
      </div>

      <CollapsibleContent
        className={`
          overflow-hidden pb-2 transition-all data-[state=closed]:animate-collapsible-up
          data-[state=open]:animate-collapsible-down md:animate-none md:transition-none
          md:data-[state=closed]:animate-none md:data-[state=open]:animate-none
        `}>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}