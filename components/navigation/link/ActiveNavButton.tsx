'use client'

import {Button} from "@/components/ui/button";
import {usePathname} from "next/navigation";

export default function ActiveNavButton({target, children}: { target: string; children: any }) {
  const pathname = usePathname();
  const active = pathname.endsWith(target);

  return (
    <Button variant={active ? 'secondary' : 'ghost'} className="w-full justify-start !px-2 text-base text-ellipsis overflow-hidden">
      {children}
    </Button>
  )
}