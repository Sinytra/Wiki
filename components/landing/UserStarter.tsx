import {Button} from "@/components/ui/button";
import Link from "next/link";
import {BookTextIcon, CompassIcon} from "lucide-react";
import LandingStarterBase from "@/components/landing/LandingStarterBase";
import ModSearch from "@/components/landing/ModSearch";

export default function UserStarter() {
  return (
    <LandingStarterBase icon={BookTextIcon} title="Documentation"
                        desc={<span className="text-muted-foreground text-lg">Browse mod documentation</span>}>
      <div className="flex flex-col gap-8 justify-center items-center">
        <ModSearch/>

        <Button asChild className="text-primary-foreground">
          <Link href="/browse">
            <CompassIcon className="w-4 h-4 mr-2"/>
            Explore mods
          </Link>
        </Button>
      </div>
    </LandingStarterBase>
  );
}