import {ReactNode} from "react";
import ActiveNavButton from "@/components/navigation/link/ActiveNavButton";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {cn} from "@/lib/utils";

export default function SidebarNavLink({href, icon: Icon, className, nested, children}: {
  href: string;
  icon?: any;
  className?: string;
  nested?: boolean;
  children?: ReactNode;
}) {
  return (
    <LocaleNavLink href={href}>
      <ActiveNavButton target={href} nested={nested}>
        {Icon && <Icon className="shrink-0 mr-2 h-4 w-4"/>}
        <span className={cn('text-ellipsis overflow-hidden', className)}>
          {children}
        </span>
      </ActiveNavButton>
    </LocaleNavLink>
  )
}