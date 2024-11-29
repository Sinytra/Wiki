'use client'

import SidebarNavLink from "@/components/navigation/link/SidebarNavLink";
import {HomeIcon} from "lucide-react";

export default function ProjectHomepageLink({ text, slug, version }: { text: string; slug: string; version: string }) {
  return (
    <SidebarNavLink href={`/project/${slug}/${version}`} icon={HomeIcon}>
      {text}
    </SidebarNavLink>
  )
}