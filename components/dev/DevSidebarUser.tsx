'use client'

import {ChevronsUpDown, LoaderCircleIcon, LogOut, LogOutIcon} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar";
import {GitHubUserProfile} from "@/lib/service/remoteServiceApi";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import * as React from "react";
import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import {startProgress} from "next-nprogress-bar";

function LogoutModal({open}: { open: boolean; }) {
  const t = useTranslations('DevSidebarUser.logout');

  return (
    <Dialog open={open}>
      <DialogHeader>
        <VisuallyHidden>
          <DialogTitle>
            {t('title')}
          </DialogTitle>
        </VisuallyHidden>
      </DialogHeader>
      <DialogContent className="flex flex-col gap-6 justify-center items-center outline-hidden! [&>button]:hidden" aria-describedby={undefined}>
        <span>
          <LogOutIcon className="mr-2 inline-block w-5 h-5" />
          {t('desc')}
        </span>
        <LoaderCircleIcon className="mr-2 h-5 w-5 animate-spin"/>
      </DialogContent>
    </Dialog>
  )
}

export function DevSidebarUser({profile, logoutAction}: { profile: GitHubUserProfile; logoutAction: () => Promise<void> }) {
  const {isMobile} = useSidebar();
  const t = useTranslations('DevSidebarUser');
  const name = profile.name || profile.login;

  const schema = z.object({});
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });
  const [isOpen, setIsOpen] = useState(false);
  const action: () => void = form.handleSubmit(async (data) => {
    startProgress();
    setTimeout(() => setIsOpen(true), 500);
    await logoutAction();
    setIsOpen(false);
  });

  return (
    <>
      <LogoutModal open={isOpen} />

      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg"
                                 className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <Avatar className="h-8 w-8 rounded-xs">
                  <AvatarImage src={profile.avatar_url} alt={name}/>
                  <AvatarFallback className="rounded-xs">
                    {t('unknown_avatar')}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs">{profile.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4"/>
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xs"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-xs">
                    <AvatarImage src={profile.avatar_url} alt={name}/>
                    <AvatarFallback className="rounded-xs">
                      {t('unknown_avatar')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{name}</span>
                    <span className="truncate text-xs">{profile.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator/>
              <form action={action}>
                <button className="appearance-none w-full" type="submit">
                  <DropdownMenuItem>
                    <LogOut/>
                    {t('logout.button')}
                  </DropdownMenuItem>
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}
