import { setContextLocale } from "@/lib/locales/routing";
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";
import TranslateBanner from "@/components/landing/TranslateBanner";
import Link from "next/link";
import crowdin from "@/lib/locales/crowdin";
import { ArrowRight, BlocksIcon, BookIcon, ComponentIcon, FileText, GitBranch, GitBranchIcon, Globe, HeartIcon, HopIcon, Layout, UserPlus } from "lucide-react";
import GradleIcon from "@/components/ui/icons/GradleIcon";

export const dynamic = 'force-static';

function HomePageContent() {
  const t = useTranslations('HomePage');

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <p className="text-lg text-muted-foreground mb-2">Welcome to the</p>
        <h2 className="text-5xl font-bold bg-gradient-to-r text-white mb-4">Modded Minecraft Wiki</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Built to suit the very needs of Minecraft modders and players alike. Providing intuitive navigation, a clean user interface, mod browser and features for authors to make writing documentation a piece of cake.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { href: "/about", title: "About", description: "Learn more about how the wiki operates" },
          { href: "/browse", title: "Browse", description: "Browse our library of documented projects" },
          { href: "/authors", title: "Authors", description: "Host your project's documentation on our wiki" },
          { href: "/blog", title: "Blog", description: "Read about the latest wiki updates" }
        ].map((item, index) => (
          <Link key={index} href={item.href} className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
            <ArrowRight className="text-primary mt-4 self-end text-blue-600" />
          </Link>
        ))}
      </section>

      <section className="mt-12 bg-accent rounded-lg p-8">
        <h2 className="text-2xl font-bold text-accent-foreground mb-4">Key Features</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { emoji: "🌐", title: "Localization", description: "Translate your docs into world languages" },
            { emoji: "🚹", title: "Accessible", description: "Intuitive and responsive user interface" },
            { emoji: "🤝", title: "Open", description: "Let your users contribute without any programming knowledge necessary" },
            { emoji: "💸", title: "Free", description: "Hosting docs on our website is completely free of charge!" }
          ].map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-2xl mr-2">{feature.emoji}</span>
              <div>
                <h3 className="font-semibold text-accent-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">Join Our Community</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-card-foreground mb-4">Authors</h3>
            <p className="text-muted-foreground mb-4">Get access to the Project Dashboard and enjoy these benefits:</p>
            <div className="space-y-4">
              {[
                { text: "Versioning support for your documentation", icon: <GitBranchIcon /> },
                { text: "Custom components for recipes, assets, etc.", icon: <ComponentIcon /> },
                { text: "Gradle integration for seamless workflow", icon: <BlocksIcon /> },
                { text: "Advanced project management tools", icon: <BookIcon /> },
                { text: "Direct interaction with your user base", icon: <HeartIcon /> },
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-3 text-muted-foreground">{item.icon}</div>
                  <p className="text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
            <Link href="/authors" className="mt-6 inline-flex items-center text-primary hover:text-primary/80">
              Start documenting
              <ArrowRight className="ml-2 text-blue-600" />
            </Link>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-card-foreground mb-4">Users</h3>
            <p className="text-muted-foreground mb-4">Explore our featured projects and enjoy these benefits:</p>
            <div className="space-y-4">
              {[
                { text: "Access high-quality, up-to-date documentation", icon: <FileText /> },
                { text: "Contribute to projects without programming knowledge", icon: <UserPlus /> },
                { text: "Enjoy a consistent, user-friendly interface across all projects", icon: <Layout /> },
                { text: "Benefit from multi-language support", icon: <Globe /> },
                { text: "Easily navigate between different versions of documentation", icon: <HopIcon /> },
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-3 text-muted-foreground">{item.icon}</div>
                  <p className="text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
            <Link href="/browse" className="mt-6 inline-flex items-center text-primary hover:text-primary/80">
              Browse projects
              <ArrowRight className="ml-2 text-blue-600" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12 bg-muted rounded-lg p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">About Us</h2>
        <p className="text-muted-foreground mb-4">
          The Wiki is built and maintained by Sinytra, a team of passionate developers creating Free and Open Source common Minecraft modding software.
        </p>
        <p className="text-muted-foreground mb-4">
          If you like our work, feel free to check out our other projects found on our GitHub page ❤️.
        </p>
        <Link href="https://github.com/Sinytra" className="inline-flex items-center text-primary hover:text-primary/80">
          Visit our GitHub
          <ArrowRight className="ml-2 text-blue-600" />
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Contributing</h2>
        <p className="text-muted-foreground mb-4">
          To edit a documentation page, use the Edit page on GitHub button found at the bottom of the right side panel.
        </p>
        <p className="text-muted-foreground mb-4">
          As project documentation is sourced from GitHub repositories, you can either use the GitHub web editor, or clone the repository and make changes locally. Then, once you're done making changes, you can submit a Pull Request to the upstream repository and wait for it to be reviewed / merged by a maintainer.
        </p>
      </section>
    </main>
  );
}

export default async function Home({ params }: { params: { locale: string } }) {
  setContextLocale(params.locale);

  const showBanner = params.locale !== 'en' && await crowdin.getCrowdinTranslationStatus(params.locale) < 50;

  return <>
    {showBanner &&
      <div className="page-wrapper max-w-5xl mx-auto w-full px-5">
        <TranslateBanner locale={params.locale} />
      </div>
    }

    <div className={cn(showBanner && '!pt-0', "page-wrapper flex flex-1 min-h-[100vh] mx-4 sm:mx-2")}>
      <HomePageContent />
    </div>
  </>
}
