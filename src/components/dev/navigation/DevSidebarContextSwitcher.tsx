"use client"

import * as React from "react"
import {useState} from "react"
import {ChevronsUpDown} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from "@repo/ui/components/sidebar"
import {useTranslations} from "next-intl";

interface Props {
  teams: {
    name: string
    logo: React.ElementType
  }[]
}

export function DevSidebarContextSwitcher({teams}: Props) {
  const {isMobile} = useSidebar();
  const [activeTeam, setactiveTeam] = useState(teams[0]);
  const t = useTranslations('DevSidebarContextSwitcher');

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-secondary data-[state=open]:text-primary-alt">
              <div
                className={`
                  text-primary-alt flex aspect-square size-8 items-center justify-center rounded-sm bg-gray-600
                `}>
                <activeTeam.logo className="size-4"/>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto"/>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-sm"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-secondary text-xs">
              {t('title')}
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setactiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="border-tertiary flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0"/>
                </div>
                {team.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
