'use client'

import {FileHeading} from "@/lib/docs/metadata";
import DocsSidebarTitle from "@/components/docs/layout/DocsSidebarTitle";
import {useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils";

// Inspired by https://github.com/shuding/nextra/blob/main/packages/nextra-theme-docs/src/contexts/active-anchor.tsx
export default function DocsTableOfContents({headings}: { headings: FileHeading[] }) {
  const observerRef = useRef<IntersectionObserver>(null!);
  const [activeAnchor, setActiveAnchor] = useState<any>({});

  const slugs = new WeakMap();
  // @ts-ignore
  const activeSlug = Object.entries(activeAnchor).find(([, {isActive}]) => isActive)?.[0]

  useEffect(() => {
    const options = {
      rootMargin: `-70px 0px -50%`,
      threshold: [0, 1],
    };

    observerRef.current = new IntersectionObserver(
      entries => {
        setActiveAnchor((f: any) => {
          const ret = {...f};

          for (const entry of entries) {
            if (entry?.rootBounds && slugs.has(entry.target)) {
              const [slug, index] = slugs.get(entry.target);
              const aboveHalfViewport = entry.boundingClientRect.y + entry.boundingClientRect.height <= entry.rootBounds.y + entry.rootBounds.height;
              const insideHalfViewport = entry.intersectionRatio > 0;

              ret[slug] = {
                index,
                aboveHalfViewport,
                insideHalfViewport
              };
            }
          }

          let activeSlug = '';
          let smallestIndexInViewport = Infinity;
          let largestIndexAboveViewport = -1;

          for (const s in ret) {
            ret[s].isActive = false
            if (
              ret[s].insideHalfViewport &&
              ret[s].index < smallestIndexInViewport
            ) {
              smallestIndexInViewport = ret[s].index;
              activeSlug = s;
            }
            if (
              smallestIndexInViewport === Infinity &&
              ret[s].aboveHalfViewport &&
              ret[s].index > largestIndexAboveViewport
            ) {
              largestIndexAboveViewport = ret[s].index;
              activeSlug = s;
            }
          }

          if (ret[activeSlug]) ret[activeSlug].isActive = true;

          return ret;
        })
      },
      options
    );
    headings.forEach((h, i) => {
      const el = document.getElementById(h.id);
      if (el) {
        slugs.set(el, [h.id, i + 1]);
        observerRef.current.observe(el);
      }
    });

    return () => {
      observerRef.current.disconnect()
    }
  }, []);

  return (
    <nav className="flex flex-col">
      <DocsSidebarTitle>
        On this page
      </DocsSidebarTitle>

      <div className="flex flex-col gap-2 w-64">
        {headings.map((h, index) => (
          <a key={index}
             className={cn('font-medium text-ellipsis whitespace-nowrap overflow-hidden', activeSlug === h.id ? 'text-blue-500' : 'text-muted-foreground')}
             href={`#${h.id}`}>
            {h.value}
          </a>
        ))}
      </div>
    </nav>
  )
}