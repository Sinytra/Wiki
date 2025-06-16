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
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import * as React from "react";
import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import {useProgress} from "@bprogress/next";

import {UserProfile} from "@repo/shared/types/api/auth";

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
      <DialogContent className="flex flex-col items-center justify-center gap-6 outline-hidden! [&>button]:hidden" aria-describedby={undefined}>
        <span>
          <LogOutIcon className="mr-2 inline-block h-5 w-5" />
          {t('desc')}
        </span>
        <LoaderCircleIcon className="mr-2 h-5 w-5 animate-spin"/>
      </DialogContent>
    </Dialog>
  )
}

export function DevSidebarUser({profile, logoutAction}: { profile: UserProfile; logoutAction: () => Promise<void> }) {
  const {isMobile} = useSidebar();
  const t = useTranslations('DevSidebarUser');
  const {start} = useProgress();

  const schema = z.object({});
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });
  const [isOpen, setIsOpen] = useState(false);
  const action: () => void = form.handleSubmit(async (data) => {
    start();
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
                                 className="data-[state=open]:bg-secondary data-[state=open]:text-primary-alt">
                <Avatar className="h-8 w-8 rounded-sm">
                  <AvatarImage src={profile.avatar_url} alt={profile.username}/>
                  <AvatarFallback className="rounded-sm">
                    {t('unknown_avatar')}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{profile.username}</span>
                  {/*<span className="truncate text-xs">{profile.email}</span>*/}
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
                  <Avatar className="h-8 w-8 rounded-sm">
                    <AvatarImage src={profile.avatar_url} alt={profile.username}/>
                    <AvatarFallback className="rounded-sm">
                      {t('unknown_avatar')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{profile.username}</span>
                    {/*<span className="truncate text-xs">{profile.email}</span>*/}
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator/>
              <form action={action}>
                <button className="w-full appearance-none" type="submit">
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
