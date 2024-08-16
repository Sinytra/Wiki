import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function LinkTextButton({ href, target, children }: { href: string, target?: string, children: any }) {
  return (
    <Button variant="link" asChild className="p-0 h-fit font-light text-foreground text-wrap">
      <Link href={href} target={target}>
        {children}
      </Link>
    </Button>
  )
}