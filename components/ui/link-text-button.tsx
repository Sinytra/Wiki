import Link from "next/link";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

export default function LinkTextButton({ href, target, className, children }: { href: string, target?: string, className?: string, children: any }) {
  return (
    <Button type="button" variant="link" asChild className={cn(className, 'p-0 h-fit font-light text-foreground text-wrap')}>
      <Link href={href} target={target}>
        {children}
      </Link>
    </Button>
  )
}