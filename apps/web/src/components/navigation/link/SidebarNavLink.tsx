import {ReactNode} from "react";
import ActiveNavButton from "@/components/navigation/link/ActiveNavButton";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {cn} from "@repo/ui/lib/utils";

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
        {Icon && <Icon className="mr-2 h-4 w-4 shrink-0"/>}
        <span className={cn('overflow-hidden text-ellipsis', className)}>
          {children}
        </span>
      </ActiveNavButton>
    </LocaleNavLink>
  )
}