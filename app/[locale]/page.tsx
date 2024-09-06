import DevStarter from "@/components/landing/DevStarter";
import LandingWidget from "@/components/landing/LandingWidget";
import UserStarter from "@/components/landing/UserStarter";
import {setContextLocale} from "@/lib/locales/routing";

export const dynamic = 'force-static';

export default async function Home({ params }: { params: { locale: string } }) {
  setContextLocale(params.locale);
  
  return <>
    <main className="flex max-w-5xl mx-auto flex-col items-center justify-between w-full px-2 md:px-0">
      <div className="z-10 w-full items-center justify-center text-2xl md:flex">
        <p className="text-2xl md:text-4xl text-foreground flex flex-col lg:flex-row items-center gap-x-2">
          <span>Welcome to the</span><span
          className="text-center font-medium bg-gradient-to-b from-blue-400 to-blue-500 bg-clip-text text-transparent">
          Modded Minecraft Wiki
        </span>
        </p>
      </div>

      <div className="flex flex-col h-full justify-evenly gap-10 md:gap-0 mt-10 md:mt-0">
        <UserStarter/>

        <hr className="md:w-[45rem] border-gray-600 h-1"/>

        <DevStarter/>

        <hr className="md:hidden border-gray-600 h-1"/>
      </div>

      <div className="mt-6 md:mt-0 grid text-center md:mb-0 md:w-full md:max-w-5xl md:grid-cols-4 md:text-left">
        <LandingWidget title="Browse mods" href="/browse">
          Browse our library of documented mods
        </LandingWidget>

        <LandingWidget title="Random mod" href="/random">
          Explore a random mod page
        </LandingWidget>

        <LandingWidget title="About" href="/about">
          Learn more about how the wiki operates
        </LandingWidget>

        <LandingWidget title="Developers" href="/about/devs">
          Host your mod's documentation on our wiki
        </LandingWidget>
      </div>
    </main>
  </>
}
