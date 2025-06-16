import {Button} from "@/components/ui/button";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";

export default function MutedLinkIconButton({ icon: Icon, href, variant }: { icon: any; href: string, variant?: string }) {
  return (
    // @ts-expect-error
    <Button variant={variant || 'ghost'} size="icon" className="text-secondary">
      <LocaleNavLink href={href} target="_blank">
        <Icon className="h-5 w-5"/>
      </LocaleNavLink>
    </Button>
  )
}