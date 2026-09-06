'use client';

import * as React from 'react';
import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@repo/ui/components/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@repo/ui/components/sidebar';
import { useTranslations } from 'next-intl';
import { LocaleNavLink } from '@/components/navigation/link/LocaleNavLink';

export interface Context {
  name: string;
  logo: React.ElementType;
  url?: string;
}

interface Props {
  contexts: Context[];
}

function WrapContext({ ctx, children }: { ctx: Context; children: React.ReactNode }) {
  if (ctx.url) {
    return <LocaleNavLink href={ctx.url}>{children}</LocaleNavLink>;
  }
  return children;
}

export function DevSidebarContextSwitcher({ contexts }: Props) {
  const { isMobile } = useSidebar();
  const [activeCtx, setActiveCtx] = useState(contexts[0]);
  const t = useTranslations('DevSidebarContextSwitcher');

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-secondary data-[state=open]:text-primary-alt">
              <div
                className={`flex aspect-square size-8 items-center justify-center rounded-sm bg-placeholder text-primary-alt`}
              >
                {/*@ts-expect-error min-size*/}
                <activeCtx.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {/*@ts-expect-error min-size*/}
                  {activeCtx.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-sm"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-secondary">{t('title')}</DropdownMenuLabel>
            {contexts.map((ctx) => (
              <WrapContext key={ctx.name} ctx={ctx}>
                <DropdownMenuItem onClick={() => setActiveCtx(ctx)} className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-sm border border-tertiary">
                    <ctx.logo className="size-4 shrink-0" />
                  </div>
                  {ctx.name}
                </DropdownMenuItem>
              </WrapContext>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
