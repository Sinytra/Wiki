import {redirect, setContextLocale} from "@/lib/locales/routing";
import {useTranslations} from 'next-intl';
import {cn, trimText} from "@/lib/utils";
import TranslateBanner from "@/components/landing/TranslateBanner";
import Link from "next/link";
import crowdin from "@/lib/locales/crowdin";
import {
  ArrowRight,
  BookIcon,
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
import GradleIcon from "@/components/ui/icons/GradleIcon";
import {Button} from "@/components/ui/button";
import ModrinthIcon from "@/components/ui/icons/ModrinthIcon";
import GitHubIcon from "@/components/ui/icons/GitHubIcon";
import CurseForgeIcon from "@/components/ui/icons/CurseForgeIcon";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import remoteServiceApi, {FeaturedProject} from "@/lib/service/remoteServiceApi";
import {Suspense, use} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {allBlogs} from "@/.contentlayer/generated";
import {compareDesc, formatDistanceStrict} from "date-fns";
import SocialButtons from "@/components/ui/custom/SocialButtons";
import LargePersonStandingIcon from "@/components/ui/icons/LargePersonStandingIcon";
import localPreview from "@/lib/previewer/localPreview";
import Image from "next/image";

export const dynamic = 'force-static';

function FeaturedProjectsContent({projects}: { projects: Promise<FeaturedProject[]> }) {
  const resolved = use(projects);
  const t = useTranslations('HomePage');
  const projectTypes = useTranslations('ProjectTypes');

  const height = resolved.length == 1 ? 100 : Math.floor(resolved.length / 3.0);

  return resolved.map((project, index) => (
    <div key={index} className={cn('h-full bg-primary-alt p-6 rounded-md shadow-sm flex flex-col', `max-h-[${height}%]`)}>
      <div className="flex items-center mb-4">
        <Image
          src={project.icon}
          alt={`${project.title} icon`}
          width={48}
          height={48}
          className="rounded-md mr-4"
        />
        <div>
          <h4 className="text-xl font-semibold text-primary-alt">{project.title}</h4>
          {projectTypes(project.type)}
        </div>
      </div>
      <p className="text-secondary mb-4 grow">
        {trimText(project.summary, 100)}
      </p>
      <div className="flex justify-between items-center">
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
    <div key={index} className="h-full bg-primary-alt p-6 rounded-lg shadow-md flex flex-col">
      <Skeleton className="w-full h-full"/>
    </div>
  ))
}

function HomePageContent() {
  const t = useTranslations('HomePage');
  const featuredProjects = remoteServiceApi.getFeaturedProjects();
  const blogPosts = allBlogs.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date))).slice(0, 3);

  return (
    <main className="container mx-auto px-4">
      <section className="mb-5 pb-4">
        <div className="text-center text-lg text-secondary mb-2">
          {t.rich('title', {
            highlight: (chunks) => (
              <h2
                className="text-center text-5xl font-bold bg-linear-to-r from-blue-500 via-cyan-300 to-blue-500 text-transparent bg-clip-text animate-gradient mb-4">
                {chunks}
              </h2>
            )
          })}
        </div>
        <p className="text-center text-xl text-secondary mx-auto">
          {t('subtitle')}
        </p>
        <div className="text-center mt-8 md:hidden">
          <LocaleNavLink href="/browse"
            className="w-fit block mx-auto bg-linear-to-r from-blue-500 via-contrast to-blue-500 text-white animate-gradient rounded-sm px-12 py-2">
            {t('browse')}
          </LocaleNavLink>
        </div>
      </section>

      <section className="mb-16 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left column: Popular Wikis */}
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-primary-alt mb-6 text-center">
                {t('popular.title')}
              </h3>
              <div className="flex flex-col h-full gap-6">
                <Suspense fallback={<FeaturedProjectsFallback/>}>
                  <FeaturedProjectsContent projects={featuredProjects}/>
                </Suspense>
              </div>
              <div className="mt-auto">
                <p className="mt-6 text-secondary text-sm">
                  {t('popular.disclaimer')}
                </p>
              </div>
            </div>

            {/* Right column: Authors (top) and Users (below) */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-primary-alt mb-6 text-center">
                  {t('community.title')}
                </h3>
                <div className="bg-primary-alt p-6 rounded-lg shadow-md">
                  <h4 className="text-2xl font-semibold text-primary-alt mb-4">
                    {t('community.users.title')}
                  </h4>
                  <p className="text-secondary mb-4">
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
                      className="block w-full text-center bg-contrast hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm transition duration-300"
                    >
                      {t('browse')}
                    </LocaleNavLink>
                  </div>
                </div>
                <div className="mt-4 bg-primary-alt p-6 rounded-lg shadow-md">
                  <h4 className="text-2xl font-semibold text-primary-alt mb-4">
                    {t('community.authors.title')}
                  </h4>
                  <p className="text-secondary mb-4">
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
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                      href="/dev"
                      className="text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm transition duration-300"
                    >
                      {t('community.authors.dashboard')}
                    </Link>
                    <LocaleNavLink
                      href="/about/devs"
                      className="text-center bg-neutral-600 hover:bg-neutral-700 text-white font-bold py-2 px-4 rounded-sm transition duration-300"
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

      <section className="mt-12 bg-secondary rounded-lg p-8">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <span className="text-2xl mr-3 pt-[3px]">
                <feature.icon className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-semibold text-primary-alt">{feature.title}</h3>
                <p className="text-secondary">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 bg-primary-alt rounded-lg p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              {t('about.title')}
            </h2>
            <p className="text-secondary mb-4">
              {t.rich('about.maintainers', { b: (chunks) => (<b>{chunks}</b>)})}
            </p>
            <p className="text-secondary mb-4">
              {t('about.mission')}
            </p>
            <SocialButtons />
          </div>
          <div className="lg:w-2/3">
            <h2 className="text-xl font-semibold mb-4">
              {t('blog.title')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post, index) => (
                <div
                  key={index}
                  className={`bg-primary rounded-lg p-4 flex flex-col border ${index === 0 ? 'border-[var(--vp-c-brand-1)]' : 'border-neutral-600'}`}
                >
                  <h4 className="text-lg font-semibold mb-2">{post.title}</h4>
                  <p className="text-sm text-secondary mb-2">{formatDistanceStrict(post.date, new Date(), { addSuffix: true })}</p>
                  <p className="text-secondary grow">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post._id.replace(".mdx", "")}`}
                    className="text-primary hover:text-primary/80 mt-2 inline-flex items-center"
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

export default async function Home({params}: { params: { locale: string } }) {
  setContextLocale(params.locale);

  if (localPreview.isEnabled()) {
    return redirect({href: '/preview', locale: params.locale});
  }

  const showBanner = params.locale !== 'en' && await crowdin.getCrowdinTranslationStatus(params.locale) < 50;

  return <>
    {showBanner &&
      <div className="page-wrapper-base page-wrapper max-w-5xl mx-auto w-full px-5 mb-5">
          <TranslateBanner locale={params.locale}/>
      </div>
    }

    <div className={cn(showBanner && 'pt-0!', 'page-wrapper-base page-wrapper page-wrapper-ext flex flex-1 min-h-[100vh] sm:mx-2')}>
      <HomePageContent/>
    </div>
  </>
}
