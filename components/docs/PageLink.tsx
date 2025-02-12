import {default as NextLink} from "next/link";
import {Link as LocaleLink} from "@/lib/locales/routing";
import {cn} from "@/lib/utils";

export default function PageLink({href, target, local, className, children}: {href: string; target?: string; local?: boolean; className?: string; children?: any}) {
  const Element = local ? LocaleLink : NextLink;
  return (
    <Element href={href} target={target} className={cn(className, 'text-base text-blue-400 hover:text-blue-400/80 hover:underline underline-offset-4 decoration-1')}>
      {children}
    </Element>
  )
}