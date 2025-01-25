'use client'

import {cn} from "@/lib/utils";
import {Link, usePathname} from "@/lib/locales/routing";

export default function DocsFileLink({href, children}: { href: string, children: any }) {
  const path = usePathname();
  const active = path === href;

  return (
    <Link href={href}
          className={
            cn(
              'flex items-center px-3 py-2 text-sm text-secondary hover:bg-secondary hover:text-primary-alt rounded-md',
              active && 'text-primary-alt bg-secondary'
            )
          }>
      {children}
    </Link>
  )
}