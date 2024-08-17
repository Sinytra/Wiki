'use client'

import {ReactNode} from "react";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function SidebarNavLink({href, icon: Icon, children}: { href: string, icon?: any, children?: ReactNode }) {
  const pathname = usePathname();

  const active = pathname === href;

  return (
    <Button asChild variant={active ? 'secondary' : 'ghost'} className="justify-start pl-2 text-base">
      <Link href={href}>
        {Icon && <Icon className="mr-2 h-4 w-4"/>} {children}
      </Link>
    </Button>
  )
}