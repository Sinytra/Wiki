'use client'

import LinkTextButton from "@/components/ui/link-text-button";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

export default function DocsEntryLink({href, children}: { href: string, children: any }) {
  const path = usePathname();
  const active = path === href;

  return (
    <LinkTextButton href={href}
                    className={cn('w-full justify-start !p-2 hover:bg-accent', active && 'bg-accent')}>
      {children}
    </LinkTextButton>
  )
}