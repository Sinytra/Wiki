import DevStarter from "@/components/landing/DevStarter";
import ModSearch from "@/components/landing/ModSearch";
import LandingWidget from "@/components/landing/LandingWidget";

export default async function Home() {
  return <>
    <main className="flex max-w-5xl mx-auto flex-col items-center justify-start gap-28">
      <div className="z-10 w-full items-center justify-center text-2xl lg:flex">
        <p className="text-4xl text-blue-500">Welcome to Sinytra's Modded MC Wiki Prototype</p>
      </div>

      <ModSearch/>

      <hr className="w-[45rem] border-gray-600 h-1"/>

      <DevStarter/>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <LandingWidget title="Browse mods" href="/browse">
          Browse documented mods
        </LandingWidget>

        {/*Not so random, shhh*/}
        <LandingWidget title="Random mod" href="/mod/mffs">
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
