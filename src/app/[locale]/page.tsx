import {redirect, setContextLocale} from "@/lib/locales/routing";
import {useTranslations} from 'next-intl';
import {trimText} from "@/lib/utils";
import {cn} from "@repo/ui/lib/utils";
import TranslateBanner from "@/components/landing/TranslateBanner";
import Link from "next/link";
import crowdin from "@/lib/locales/crowdin";
import {
  ArrowRight,
  BookIcon, BoxIcon,
  ComponentIcon,
  FileText,
  GitBranchIcon,
  GitPullRequestArrowIcon,
  Globe,
  GlobeIcon,
  HeartHandshakeIcon,
  HeartIcon,
  Layout,
  UserPlus
} from "lucide-react";
import GradleIcon from "@repo/ui/icons/GradleIcon";
import {Button} from "@repo/ui/components/button";
import ModrinthIcon from "@repo/ui/icons/ModrinthIcon";
import GitHubIcon from "@repo/ui/icons/GitHubIcon";
import CurseForgeIcon from "@repo/ui/icons/CurseForgeIcon";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {CSSProperties, Suspense, use} from "react";
import {Skeleton} from "@repo/ui/components/skeleton";
import {allBlogs} from "@/.contentlayer/generated";
import {compareDesc, formatDistanceStrict} from "date-fns";
import SocialButtons from "@/components/util/SocialButtons";
import LargePersonStandingIcon from "@repo/ui/icons/LargePersonStandingIcon";
import env from "@repo/shared/env";
import featuredProjects, {FeaturedProject} from "@/lib/service/featuredProjects";
import SafeImage from "@/components/util/SafeImage";
import {DEFAULT_LOCALE} from "@repo/shared/constants";

export const revalidate = 1209600; // 60 * 60 * 24 * 14

function FeaturedProjectsContent({projects}: { projects: Promise<FeaturedProject[]> }) {
  const resolved = use(projects);
  const t = useTranslations('HomePage');
  const projectTypes = useTranslations('ProjectTypes');

  const height = resolved.length == 1 ? 100 : Math.floor(100 / resolved.length);
  const style = { "--default-max-h": `${height}%` } as CSSProperties;

  return resolved.map((project, index) => (
    <div key={index}
         className={`
           flex h-full max-h-[var(--default-max-h)] flex-col rounded-md bg-primary-alt p-6 shadow-sm sm:max-h-fit
         `}
         style={style}
    >
      <div className="mb-4 flex items-center">
        <SafeImage
          src={project.icon}
          alt={`${project.title} icon`}
          width={48}
          height={48}
          className="mr-4 rounded-sm"
          fallback={
            <div className="mr-4 flex size-12 shrink-0 rounded-sm border border-tertiary">
              <BoxIcon strokeWidth={1} className="m-auto text-secondary opacity-20" width={32} height={32}/>
            </div>
          }
        />
        <div>
          <h4 className="text-xl font-semibold text-primary-alt">{project.title}</h4>
          {projectTypes(project.type)}
        </div>
      </div>
      <p className="mb-4 grow text-secondary">
        {trimText(project.summary, 100)}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {project.links.curseforge && (
            <a href={project.links.curseforge} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <CurseForgeIcon className="h-4 w-4"/>
              </Button>
            </a>
          )}
          {project.links.modrinth && (
            <a href={project.links.modrinth} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <ModrinthIcon className="h-4 w-4"/>
              </Button>
            </a>
          )}
          {project.links.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <GitHubIcon className="h-4 w-4"/>
              </Button>
            </a>
          )}
        </div>
        <Button variant="link" className="text-primary hover:text-primary/80">
          <LocaleNavLink className="flex flex-row items-center" href={`/project/${project.id}`}>
            {t('popular.open')}
            <ArrowRight className="ml-2 h-4 w-4 text-contrast"/>
          </LocaleNavLink>
        </Button>
      </div>
    </div>
  ))
}

function FeaturedProjectsFallback() {
  return [0, 1, 2].map(index => (
    <div key={index} className="flex h-full flex-col rounded-lg bg-primary-alt p-6 shadow-md">
      <Skeleton className="h-full w-full"/>
    </div>
  ))
}

function HomePageContent() {
  const t = useTranslations('HomePage');
  const projects = featuredProjects.getFeaturedProjects();
  const blogPosts = allBlogs.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date))).slice(0, 3);

  return (
    <main className="container mx-auto px-4">
      <section className="mb-5 pb-4">
        <div className="mb-2 text-center text-lg text-secondary">
          {t.rich('title', {
            highlight: (chunks: any) => (
              <h2
                className={`
                  mb-4 animate-gradient bg-linear-to-r from-blue-500 via-cyan-300 to-blue-500 bg-clip-text text-center
                  text-5xl font-bold text-transparent
                `}>
                {chunks}
              </h2>
            )
          })}
        </div>
        <p className="mx-auto text-center text-xl text-secondary">
          {t('subtitle')}
        </p>
        <div className="mt-8 text-center md:hidden">
          <LocaleNavLink href="/browse"
                         className={`
                           mx-auto block w-fit animate-gradient rounded-sm bg-linear-to-r from-blue-500 via-contrast
                           to-blue-500 px-12 py-2 text-white
                         `}>
            {t('browse')}
          </LocaleNavLink>
        </div>
      </section>

      <section className="mb-16 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left column: Popular Wikis */}
            <div className="flex flex-col">
              <h3 className="mb-6 text-center text-2xl font-bold text-primary-alt">
                {t('popular.title')}
              </h3>
              <div className="flex h-full flex-col gap-6">
                <Suspense fallback={<FeaturedProjectsFallback/>}>
                  <FeaturedProjectsContent projects={projects}/>
                </Suspense>
              </div>
              <div className="mt-auto">
                <p className="mt-6 text-sm text-secondary">
                  {t('popular.disclaimer')}
                </p>
              </div>
            </div>

            {/* Right column: Authors (top) and Users (below) */}
            <div className="space-y-8">
              <div>
                <h3 className="mb-6 text-center text-2xl font-bold text-primary-alt">
                  {t('community.title')}
                </h3>
                <div className="rounded-lg bg-primary-alt p-6 shadow-md">
                  <h4 className="mb-4 text-2xl font-semibold text-primary-alt">
                    {t('community.users.title')}
                  </h4>
                  <p className="mb-4 text-secondary">
                    {t('community.users.subtitle')}
                  </p>
                  <div className="space-y-4">
                    {[
                      {text: t('community.users.docs'), icon: <FileText/>},
                      {text: t('community.users.contribute'), icon: <UserPlus/>},
                      {text: t('community.users.ui'), icon: <Layout/>},
                      {text: t('community.users.localization'), icon: <Globe/>}
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="mr-3 text-secondary">{item.icon}</div>
                        <p className="text-secondary">{item.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 space-y-4">
                    <LocaleNavLink
                      href="/browse"
                      className={`
                        block w-full rounded-sm bg-contrast px-4 py-2 text-center font-bold text-white transition
                        duration-300 hover:bg-blue-700
                      `}
                    >
                      {t('browse')}
                    </LocaleNavLink>
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-primary-alt p-6 shadow-md">
                  <h4 className="mb-4 text-2xl font-semibold text-primary-alt">
                    {t('community.authors.title')}
                  </h4>
                  <p className="mb-4 text-secondary">
                    {t('community.authors.subtitle')}
                  </p>
                  <div className="space-y-4">
                    {[
                      {text: t('community.authors.vcs'), icon: <GitBranchIcon/>},
                      {text: t('community.authors.components'), icon: <ComponentIcon/>},
                      {
                        text: t('community.authors.gradle'),
                        icon: <GradleIcon width={24} height={24} className=""/>
                      },
                      {text: t('community.authors.management'), icon: <BookIcon/>},
                      {text: t('community.authors.interaction'), icon: <HeartIcon/>},
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="mr-3 text-secondary">{item.icon}</div>
                        <p className="text-secondary">{item.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Link
                      href="/dev"
                      className={`
                        rounded-sm bg-blue-600 px-4 py-2 text-center font-bold text-white transition duration-300
                        hover:bg-blue-700
                      `}
                    >
                      {t('community.authors.dashboard')}
                    </Link>
                    <LocaleNavLink
                      href="/about/devs"
                      className={`
                        rounded-sm bg-neutral-600 px-4 py-2 text-center font-bold text-white transition duration-300
                        hover:bg-neutral-700
                      `}
                    >
                      {t('community.authors.guide')}
                    </LocaleNavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 rounded-lg bg-secondary p-8">
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            {icon: GlobeIcon, title: t('highlights.localization.title'), description: t('highlights.localization.desc')},
            {icon: LargePersonStandingIcon, title: t('highlights.accessibility.title'), description: t('highlights.accessibility.desc')},
            {
              icon: GitPullRequestArrowIcon,
              title: t('highlights.open.title'),
              description: t('highlights.open.desc')
            },
            {icon: HeartHandshakeIcon, title: t('highlights.free.title'), description: t('highlights.free.desc')}
          ].map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-3 pt-[3px] text-2xl">
                <feature.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-primary-alt">{feature.title}</h3>
                <p className="text-secondary">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-lg bg-primary-alt p-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-1/3">
            <h2 className="mb-4 text-xl font-semibold">
              {t('about.title')}
            </h2>
            <p className="mb-4 text-secondary">
              {t.rich('about.maintainers', { b: (chunks: any) => (<b>{chunks}</b>)})}
            </p>
            <p className="mb-4 text-secondary">
              {t('about.mission')}
            </p>
            <SocialButtons />
          </div>
          <div className="lg:w-2/3">
            <h2 className="mb-4 text-xl font-semibold">
              {t('blog.title')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post, index) => (
                <div
                  key={index}
                  className={`flex flex-col rounded-lg border bg-primary p-4 ${index === 0 ? `
                    border-[var(--vp-c-brand-1)]
                  ` : `border-neutral-600`}`}
                >
                  <h4 className="mb-2 text-lg font-semibold">{post.title}</h4>
                  <p className="mb-2 text-sm text-secondary">{formatDistanceStrict(post.date, new Date(), { addSuffix: true })}</p>
                  <p className="grow text-secondary">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post._id.replace(".mdx", "")}`}
                    className="mt-2 inline-flex items-center text-primary hover:text-primary/80"
                  >
                    {t('blog.open')}
                    <ArrowRight className="ml-2 h-4 w-4"/>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function Home(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setContextLocale(params.locale);

  if (env.isPreview()) {
    return redirect({href: '/preview', locale: params.locale});
  }

  const showBanner = params.locale !== DEFAULT_LOCALE && (await crowdin.getCrowdinTranslationStatus(params.locale)) < 50;

  return <>
    {showBanner &&
      <div className="page-wrapper-base page-wrapper mx-auto mb-5 w-full max-w-5xl px-5">
          <TranslateBanner locale={params.locale}/>
      </div>
    }

    <div className={cn(showBanner && 'pt-0!', `
      page-wrapper-base page-wrapper page-wrapper-ext flex min-h-[100vh] flex-1 sm:mx-2
    `)}>
      <HomePageContent/>
    </div>
  </>
}
