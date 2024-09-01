import DevStarter from "@/components/landing/DevStarter";
import LandingWidget from "@/components/landing/LandingWidget";
import UserStarter from "@/components/landing/UserStarter";

export default async function Home() {
  return <>
    <main className="flex max-w-5xl mx-auto flex-col items-center justify-between">
      <div className="z-10 w-full items-center justify-center text-2xl lg:flex">
        <p className="text-4xl text-foreground">
          Welcome to <span className="font-medium bg-gradient-to-b from-blue-400 to-blue-500 bg-clip-text text-transparent">Sinytra's Modded Minecraft Wiki</span>
        </p>
      </div>

      <div className="flex flex-col h-full justify-evenly">
        <UserStarter />

        <hr className="w-[45rem] border-gray-600 h-1"/>

        <DevStarter/>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
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
