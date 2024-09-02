import {Button} from "@/components/ui/button";
import {BookTextIcon, CompassIcon} from "lucide-react";
import LandingStarterBase from "@/components/landing/LandingStarterBase";
import ModSearch from "@/components/landing/ModSearch";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {getLocale} from "next-intl/server";

export default async function UserStarter() {
  const locale = await getLocale(); 

  return (
    <LandingStarterBase icon={BookTextIcon} title="Documentation"
                        desc={<span className="text-muted-foreground text-lg">Browse mod documentation</span>}>
      <div className="flex flex-col gap-8 justify-center items-center w-full sm:w-fit">
        <ModSearch locale={locale}/>

        <Button asChild className="text-primary-foreground">
          <LocaleNavLink href="/browse">
            <CompassIcon className="w-4 h-4 mr-2"/>
            Explore mods
          </LocaleNavLink>
        </Button>
      </div>
    </LandingStarterBase>
  );
}