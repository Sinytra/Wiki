'use client'

import LinkTextButton from "@/components/ui/link-text-button";
import {cn} from "@/lib/utils";
import {usePathname} from "@/lib/locales/routing";

export default function DocsEntryLink({href, children}: { href: string, children: any }) {
  const path = usePathname();
  const active = path === href;

  return (
    <LinkTextButton href={href}
                    className={cn('inline-flex items-center gap-2 w-full justify-start !p-2 hover:bg-accent', active && 'bg-accent')}>
      {children}
    </LinkTextButton>
  )
}