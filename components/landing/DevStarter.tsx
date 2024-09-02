import {PencilRulerIcon} from "lucide-react";
import LinkTextButton from "@/components/ui/link-text-button";
import LandingStarterBase from "@/components/landing/LandingStarterBase";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";

export default function DevStarter() {
  return (
    <LandingStarterBase icon={PencilRulerIcon} title="Developers" desc={
      <>
        <span className="text-muted-foreground text-lg">Looking to add your mod as a developer?</span>
        <span className="text-muted-foreground text-lg">Get started by reading our <LinkTextButton
          className="!text-foreground !font-normal !text-lg" href="/about">author guide</LinkTextButton>.</span>
      </>
    }>
      <LocaleNavLink href="/dev">
        <button className="bg-blue-900 p-2.5 px-5 rounded-sm">Developer area</button>
      </LocaleNavLink>
    </LandingStarterBase>
  )
}