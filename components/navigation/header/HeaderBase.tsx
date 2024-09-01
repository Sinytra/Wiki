'use client'

import {useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils";

export default function HeaderBase({children}: { children: any }) {
  const binding = useRef<HTMLHeadingElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    document.addEventListener("scroll", onScroll);

    return () => document.removeEventListener("scroll", onScroll);
  }, [scrolled]);
  
  return (
    <header className={cn("fixed left-0 w-[100vw] bg-background transition-shadow motion-reduce:transition-none z-50", scrolled && 'shadow-xl')} ref={binding}>
      {children}
    </header>
  )
}