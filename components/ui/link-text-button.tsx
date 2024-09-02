import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";

export default function LinkTextButton({ href, target, className, children }: { href: string, target?: string, className?: string, children: any }) {
  return (
    <Button type="button" variant="link" asChild className={cn(className, 'p-0 h-fit font-light text-foreground text-wrap')}>
      <LocaleNavLink href={href} target={target}>
        {children}
      </LocaleNavLink>
    </Button>
  )
}