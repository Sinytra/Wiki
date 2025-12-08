'use client'

import {cn} from "@repo/ui/lib/utils";
import {usePathname} from "@/lib/locales/routing";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";

export default function DocsFileLink({href, children}: { href: string, children: any }) {
  const path = usePathname();
  const active = path === href;

  return (
    <LocaleNavLink href={href}
          className={
            cn(
              'flex items-center rounded-md px-3 py-2 text-sm text-secondary hover:bg-secondary hover:text-primary-alt',
              active && 'bg-secondary text-primary-alt'
            )
          }>
      {children}
    </LocaleNavLink>
  )
}