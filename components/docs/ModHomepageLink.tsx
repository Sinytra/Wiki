'use client'

import SidebarNavLink from "@/components/navigation/link/SidebarNavLink";
import {HomeIcon} from "lucide-react";

export default function ModHomepageLink({ text, slug }: { text: string; slug: string }) {
  return (
    <SidebarNavLink href={`/mod/${slug}`} icon={HomeIcon}>
      {text}
    </SidebarNavLink>
  )
}