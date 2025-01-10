'use client'

import * as LucideIcons from "lucide-react";
import {ChevronDown, FolderIcon} from "lucide-react";
import * as React from "react";
import {useContext, useState} from "react";
import {cn} from "@/lib/utils";
import {usePathname} from "@/lib/locales/routing";
import {LeftSidebarContext} from "@/components/docs/side/LeftSidebarContext";
import {NO_FOLDER_ICON} from "@/lib/constants";

interface DocsFileTreeFolderProps {
  name: any;
  path: string;
  icon?: any;
  level: number;
  children: any;
}

export default function DocsFileTreeFolder({name, path, icon, level, children}: DocsFileTreeFolderProps) {
  const {folderStates, setFolderStates} = useContext(LeftSidebarContext)!;

  const currentPath = usePathname().split('/').slice(4).join('/');
  if (!folderStates[path]) {
    folderStates[path] = currentPath.length > 0 && currentPath.startsWith(path + '/');
    setFolderStates(folderStates);
  }

  const [isOpen, setOpen] = useState(folderStates[path]);

  const defaultIcon = FolderIcon;
  // @ts-ignore
  const Icon = icon === null || icon === NO_FOLDER_ICON ? null : ((icon ? LucideIcons[icon] : defaultIcon) || defaultIcon);

  return (
    <div className={cn('accordion flex flex-col', isOpen && 'open')}>
      <button onClick={() => setOpen(!isOpen)} data-state={isOpen ? 'open' : 'closed'}
        className="[&[data-state=open]>svg:last-child]:rotate-180 flex items-center px-3 py-2 text-sm
                   text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
      >
        {Icon && <Icon className="flex-shrink-0 w-4 h-4 mr-2"/>}
        {name}
        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200"/>
      </button>
      <div className="accordion-body" style={{paddingLeft: `${level}rem`}}>
        <div>
          <div className="flex flex-col gap-2 mt-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}