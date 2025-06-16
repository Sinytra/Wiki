import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";

export default function LinkTextButton({href, target, className, children}: {
  href: string,
  target?: string,
  className?: string,
  children: any
}) {
  return (
    <div className="inline-block text-primary">
      <Button type="button" variant="link" asChild
              className={cn(className, 'h-fit p-0 font-light text-wrap hover:text-primary/80!')}>
        <LocaleNavLink href={href} target={target}>
          {children}
        </LocaleNavLink>
      </Button>
    </div>
  )
}