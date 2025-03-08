'use client'

import {Button} from "@/components/ui/button";
import {usePathname} from "@/lib/locales/routing";

export default function ActiveNavButton({target, nested, children}: { target: string; nested?: boolean; children: any }) {
  const pathname = usePathname();
  const active = nested ? pathname.startsWith(target) : pathname.endsWith(target);

  return (
    <Button variant={active ? 'secondary' : 'ghost'} className="w-full justify-start !px-2 text-base text-ellipsis overflow-hidden">
      {children}
    </Button>
  )
}