import {cn} from "@repo/ui/lib/utils";
import {ComponentPropsWithoutRef} from "react";
import {NavLink} from "@/components/navigation/link/NavLink";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {LocaleLink} from "@/lib/locales/routing";

type LinkProps = ComponentPropsWithoutRef<typeof LocaleLink> & { local?: boolean };

export default function PageLink({href, target, local, className, children}: LinkProps) {
  if (!href) {
    return <span className={className}>{children}</span>;
  }

  const Element = local ? LocaleNavLink : NavLink;
  return (
    <Element href={href} target={target} className={cn(className, `
      text-link decoration-1 underline-offset-4 hover:text-blue-400/80 hover:underline
    `)}>
      {children}
    </Element>
  )
}