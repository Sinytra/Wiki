'use client'

import {useLayoutEffect, useState} from "react";
import DocsSidebarTitle from "@/components/docs/layout/DocsSidebarTitle";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {usePathname} from "@/lib/locales/routing";
import {ChevronDownIcon} from "lucide-react";
import {useParams} from "next/navigation";
import FilteredLanguageSelect from "@/components/docs/FilteredLanguageSelect";

export default function CollapsibleDocsTreeBase({title, defaultOpen, locales, children}: {
  title: string;
  defaultOpen?: boolean;
  locales?: string[];
  children: any;
}) {
  const pathname = usePathname();
  const {locale} = useParams();
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
            className="docsMainTrigger md:hidden w-5 h-5 text-muted-foreground transition-transform duration-200"/>
        }>
          <span>{title}</span>
        </DocsSidebarTitle>
      </CollapsibleTrigger>
      <div className="hidden md:block">
        <DocsSidebarTitle offset noSeparator extra={
          <ChevronDownIcon
            className="docsMainTrigger md:hidden w-5 h-5 text-muted-foreground transition-transform duration-200"/>
        }>
          <span>{title}</span>
          {locales &&
            <div className="inline-flex ml-auto">
                <FilteredLanguageSelect minimal locale={locale as string} locales={locales}/>
            </div>
          }
        </DocsSidebarTitle>
      </div>

      <CollapsibleContent
        className="pb-2 overflow-hidden transition-all data-[state=open]:animate-collapsible-down md:data-[state=open]:animate-none data-[state=closed]:animate-collapsible-up md:data-[state=closed]:animate-none md:transition-none md:animate-none">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}