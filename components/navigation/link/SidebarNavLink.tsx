import {ReactNode} from "react";
import ActiveNavButton from "@/components/navigation/link/ActiveNavButton";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";

export default function SidebarNavLink({href, icon: Icon, children}: {
  href: string,
  icon?: any,
  children?: ReactNode
}) {
  return (
    <LocaleNavLink href={href}>
      <ActiveNavButton target={href}>
        {Icon && <Icon className="mr-2 h-4 w-4"/>} {children}
      </ActiveNavButton>
    </LocaleNavLink>
  )
}