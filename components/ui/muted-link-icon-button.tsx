import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function MutedLinkIconButton({ icon: Icon, href, variant }: { icon: any; href: string, variant?: string }) {
  return (
    // @ts-expect-error
    <Button variant={variant || 'ghost'} size="icon" className="text-muted-foreground">
      <Link href={href} target="_blank">
        <Icon className="w-5 h-5"/>
      </Link>
    </Button>
  )
}