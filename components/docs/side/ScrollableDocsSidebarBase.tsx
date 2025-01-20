'use client'

import {useContext, useEffect, useRef} from 'react';
import {usePathname} from "next/navigation";
import {LeftSidebarContext} from "@/components/docs/side/LeftSidebarContext";
import DocsSidebarBase from "@/components/docs/side/DocsSidebarBase";

// @ts-ignore
export default function ScrollableDocsSidebarBase(props: DocsSidebarBaseProps) {
  const {scrollPos, setScrollPos} = useContext(LeftSidebarContext)!;
  const sidebarRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        setScrollPos(sidebarRef.current.scrollTop);
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTop = scrollPos;
    }
  }, [pathname])

  return (
    <DocsSidebarBase {...props} ref={sidebarRef} />
  )
}