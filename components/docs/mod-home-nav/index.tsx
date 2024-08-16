'use client'

import {usePathname} from "next/navigation";
import Link from "next/link";
import {HomeIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function ModHomeNav({ slug }: { slug: string }) {
  const pathname = usePathname();
  
  const target = `/mod/${slug}`;
  const active = pathname === target; 

  return (
    <Button asChild variant={active ? 'secondary' : 'ghost'} className="mb-4 justify-start pl-2 text-base">
      <Link href={target}>
        <HomeIcon className="mr-2 h-4 w-4"/> Mod homepage
      </Link>
    </Button>
  )
}