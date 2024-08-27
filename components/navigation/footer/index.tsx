import React from "react";
import Link from "next/link";
import localPreview from "@/lib/docs/localPreview";
import {cn} from "@/lib/utils";

function Copyright({ center }: { center: boolean }) {
  return <>
    <div className={cn("flex flex-col items-center sm:basis-96", !center && 'sm:items-start')}>
      <span className="font-medium text-foreground">
        📖 The Modded Minecraft Wiki
      </span>
      <p className="mt-6 text-sm">
        © {new Date().getFullYear()} The Sinytra Project.
      </p>
    </div>
  </>
}

function LinkEntry({title, href}: { title: string, href: string }) {
  return <>
    <ul>
      <li>
        <Link
          className="hover:text-secondary-foreground transition-colors rounded-md py-0.5 text-sm text-muted-foreground outline-none"
          href={href}>
          {title}
        </Link>
      </li>
    </ul>
  </>
}

function LinkColumn({title, className, children}: { title: string, className?: string, children: React.ReactNode }) {
  return <>
    <div className={`flex flex-col gap-4 ${className}`}>
      <p className="mb-2 text-sm text-foreground font-medium">{title}</p>

      {children}
    </div>
  </>
}

function NavigationColumns() {
  return (
    <div className="grid w-full ml-auto grid-cols-2 gap-8 lg:grid-cols-4">
      <div className="hidden lg:block"></div>

      <LinkColumn title="Navigation">
        <LinkEntry title="Homepage" href="/"/>
        <LinkEntry title="Browse" href="/browse"/>
        <LinkEntry title="Developers" href="/dev"/>
      </LinkColumn>

      <LinkColumn title="Links">
        <LinkEntry title="GitHub" href="https://github.com/Sinytra"/>
        <LinkEntry title="OpenCollective" href="https://opencollective.com/sinytra"/>
      </LinkColumn>

      <LinkColumn title="Community">
        <LinkEntry title="Discord" href="https://discord.sinytra.org"/>
      </LinkColumn>
    </div>
  );
}

export default function Footer() {
  const isPreview = localPreview.isEnabled();
  
  return (
    <footer
      className="w-full bg-muted pt-12 pb-6 mx-auto flex flex-col justify-center items-center border-t border-border">
      <div className="px-8 w-full max-w-[90rem] text-muted-foreground flex flex-col gap-8">
        <div
          className={cn("flex flex-wrap-reverse sm:flex-nowrap sm:flex-row w-full justify-center gap-y-8", !isPreview && 'sm:justify-between')}>
          <Copyright center={isPreview}/>

          { !isPreview && <NavigationColumns /> }
        </div>
        <div className="text-center">
          <span className="text-xs text-muted-foreground">NOT AN OFFICIAL MINECRAFT WEBSITE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.</span>
        </div>
      </div>
    </footer>
  )
}
