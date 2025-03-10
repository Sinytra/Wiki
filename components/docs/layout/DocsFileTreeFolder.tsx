'use client'

import * as LucideIcons from "lucide-react";
import {ChevronDown, FolderIcon} from "lucide-react";
import * as React from "react";
import {useContext, useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils";
import {usePathname} from "@/lib/locales/routing";
import {LeftSidebarContext} from "@/components/docs/side/LeftSidebarContext";
import {NO_FOLDER_ICON} from "@/lib/constants";
import {undefined} from "zod";

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

  const defaultOpen = currentPath.length > 0 && currentPath.startsWith(path + '/');

  const rendered = useRef(false);
  const [isOpen, setOpen] = useState(!rendered.current && defaultOpen || folderStates[level] === path);

  const defaultIcon = FolderIcon;
  // @ts-ignore
  const Icon = icon === null || icon === NO_FOLDER_ICON ? null : ((icon ? LucideIcons[icon] : defaultIcon) || defaultIcon);

  useEffect(() => {
    if (!rendered.current && defaultOpen) {
      rendered.current = true;

      // @ts-ignore
      setFolderStates(v => {
        let newStates = {...v, [level]: path};
        Object.keys(newStates)
          .filter(k => Number(k) > level && !currentPath.startsWith(newStates[k]))
          .forEach(k => delete newStates[k]);
        return newStates;
      });
    }
  }, []);

  useEffect(() => {
    setOpen(folderStates[level] === path);
  }, [folderStates]);

  function toggleOpen() {
    // @ts-ignore
    setFolderStates(v => {
      // Close other folders at the same level
      let newStates = {...v, [level]: isOpen ? undefined : path};
      // Close all nested folders
      if (isOpen) {
        Object.keys(newStates)
          .filter(k => Number(k) > level)
          .forEach(k => delete newStates[k]);
      }
      return newStates;
    });
  }

  return (
    <div className={cn('accordion flex flex-col', isOpen && 'open')}>
      <button onClick={toggleOpen} data-state={isOpen ? 'open' : 'closed'}
        className="[&[data-state=open]>svg:last-child]:rotate-180 flex items-center px-3 py-2 text-sm
                   text-secondary hover:bg-secondary hover:text-primary-alt rounded-md"
      >
        {Icon && <Icon className="shrink-0 w-4 h-4 mr-2"/>}
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