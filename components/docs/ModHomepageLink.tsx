'use client'

import SidebarNavLink from "@/components/navigation/link/SidebarNavLink";
import {HomeIcon} from "lucide-react";

export default function ModHomepageLink({ text, slug, version }: { text: string; slug: string; version: string }) {
  return (
    <SidebarNavLink href={`/mod/${slug}/${version}`} icon={HomeIcon}>
      {text}
    </SidebarNavLink>
  )
}