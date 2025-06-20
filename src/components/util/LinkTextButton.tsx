import {Button} from "@repo/ui/components/button";
import {cn} from "@repo/ui/lib/utils";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";

export default function LinkTextButton({href, target, className, children}: {
  href: string,
  target?: string,
  className?: string,
  children: any
}) {
  return (
    <div className="text-primary inline-block">
      <Button type="button" variant="link" asChild
              className={cn(className, 'hover:text-primary/80! h-fit p-0 font-light text-wrap')}>
        <LocaleNavLink href={href} target={target}>
          {children}
        </LocaleNavLink>
      </Button>
    </div>
  )
}