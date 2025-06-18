'use client'

import {Button} from "@repo/ui/components/button";
import {usePathname} from "@/lib/locales/routing";

export default function ActiveNavButton({target, nested, children}: { target: string; nested?: boolean; children: any }) {
  const pathname = usePathname();
  const active = nested ? pathname.startsWith(target) : pathname.endsWith(target);

  return (
    <Button variant={active ? 'secondary' : 'ghost'} className={`
      w-full justify-start overflow-hidden !px-2 text-base text-ellipsis
    `}>
      {children}
    </Button>
  )
}