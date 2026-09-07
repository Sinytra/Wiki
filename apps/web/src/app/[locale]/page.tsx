import { setContextLocale } from '@/lib/locales/routing';
import { useTranslations } from 'next-intl';
import { cn } from '@repo/ui/lib/utils';
import TranslateBanner from '@/components/navigation/TranslateBanner';
import crowdin from '@/lib/locales/crowdin';
import { BookIcon, BoxIcon, ComponentIcon, GitBranchIcon, HeartIcon, PencilRulerIcon, SearchIcon } from 'lucide-react';
import GradleIcon from '@repo/ui/icons/GradleIcon';
import { Button } from '@repo/ui/components/button';
import ModrinthIcon from '@repo/ui/icons/ModrinthIcon';
import CurseForgeIcon from '@repo/ui/icons/CurseForgeIcon';
import CurseForgeColorIcon from '@repo/ui/icons/CurseForgeColorIcon';
import { LocaleNavLink } from '@/components/navigation/link/LocaleNavLink';
import { ComponentType, ReactNode } from 'react';
import { allBlogs } from '@/.contentlayer/generated';
import { compareDesc, format } from 'date-fns';
import SocialButtons from '@/components/util/SocialButtons';
import env from '@repo/shared/env';
import featuredProjects, { FeaturedProject } from '@/lib/service/featuredProjects';
import { DEFAULT_LOCALE, ORACLE_INDEX_LINKS, WIKI_DOCS_URL } from '@repo/shared/constants';
import ImageWithFallback from '@/components/util/ImageWithFallback';
import { NavLink } from '@/components/navigation/link/NavLink';
import navigation from '@/lib/discovery/navigation';

export const dynamic = 'force-static';
export const revalidate = 1209600; // 60 * 60 * 24 * 14

type IconComponent = ComponentType<{ className?: string }>;

function GradleFeatureIcon({ className }: { className?: string }) {
  return <GradleIcon width={16} height={16} className={className} />;
}

function Tile({
  title,
  action,
  className,
  bodyClassName,
  children
}: {
  title?: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        'flex flex-col gap-4 overflow-hidden rounded-sm border border-tertiary/90 bg-primary-alt p-4',
        className
      )}
    >
      {title && (
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-base font-medium text-primary">{title}</h2>
          {action && <div className="ml-auto text-sm">{action}</div>}
        </div>
      )}

      <div className={cn('flex grow flex-col gap-4', bodyClassName)}>{children}</div>
    </section>
  );
}

function TileLink({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  const className = 'inline-flex items-center gap-1 text-sm text-brand-primary hover:underline underline-offset-4';
  return external ? (
    <NavLink href={href} className={className}>
      {children}
    </NavLink>
  ) : (
    <LocaleNavLink href={href} className={className}>
      {children}
    </LocaleNavLink>
  );
}

function FeatureList({ items }: { items: { icon: IconComponent; text: string }[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, idx) => (
        <li key={idx} className="flex flex-row items-start gap-3 text-sm text-secondary">
          <item.icon className="mt-0.5 size-4 shrink-0" />
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

function PlatformLink({ href, icon: Icon, label }: { href: string; icon: IconComponent; label: string }) {
  return (
    <Button asChild variant="ghost" size="icon" className="size-8 text-secondary" title={label}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Icon className="size-4" />
      </a>
    </Button>
  );
}

function FeaturedProjectEntry({ project }: { project: FeaturedProject }) {
  const t = useTranslations('HomePage');
  const projectTypes = useTranslations('ProjectTypes');
  const link = navigation.getProjectLink(project.id);

  return (
    <div className="flex flex-col gap-4 rounded-sm border border-tertiary bg-primary p-3">
      <div className="flex flex-row items-center gap-3">
        <ImageWithFallback
          src={project.icon}
          alt={`${project.title} icon`}
          width={40}
          height={40}
          className="size-10 rounded-sm"
          fallback={
            <div className="flex size-10 shrink-0 rounded-sm border border-tertiary">
              <BoxIcon strokeWidth={1} className="m-auto size-6 text-secondary opacity-20" />
            </div>
          }
        />

        <div className="flex min-w-0 flex-col">
          <LocaleNavLink href={link} className="truncate font-medium text-primary underline-offset-4 hover:underline">
            {project.title}
          </LocaleNavLink>
          <span className="text-xs text-secondary">{projectTypes(project.type)}</span>
        </div>
      </div>

      <p className="line-clamp-2 grow text-sm text-secondary">{project.summary}</p>

      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row gap-1.5">
          {project.links.curseforge && (
            <PlatformLink href={project.links.curseforge} icon={CurseForgeIcon} label="CurseForge" />
          )}
          {project.links.modrinth && (
            <PlatformLink href={project.links.modrinth} icon={ModrinthIcon} label="Modrinth" />
          )}
        </div>

        <TileLink href={link}>{t('popular.open')}</TileLink>
      </div>
    </div>
  );
}

function PopularWikisTile({ projects, className }: { projects: FeaturedProject[]; className?: string }) {
  const t = useTranslations('HomePage');

  return (
    <Tile title={t('popular.title')} className={className}>
      {projects.length > 0 ? (
        <div className="grid grow grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <FeaturedProjectEntry key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="grow text-sm text-secondary">{t('popular.empty')}</p>
      )}
    </Tile>
  );
}

function AuthorsTile({ className }: { className?: string }) {
  const t = useTranslations('HomePage');

  return (
    <Tile title={t('authors.title')} className={className}>
      <p className="text-sm text-secondary">{t('authors.subtitle')}</p>
      <FeatureList
        items={[
          { icon: GitBranchIcon, text: t('authors.vcs') },
          { icon: ComponentIcon, text: t('authors.components') },
          { icon: GradleFeatureIcon, text: t('authors.gradle') },
          { icon: BookIcon, text: t('authors.management') },
          { icon: HeartIcon, text: t('authors.interaction') }
        ]}
      />
      <div className="mt-auto grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
        <Button asChild className="border-none bg-contrast text-white hover:bg-contrast-hover">
          <NavLink href="/dev">{t('authors.dashboard')}</NavLink>
        </Button>
        <Button asChild variant="outline">
          <a href={WIKI_DOCS_URL}>{t('authors.guide')}</a>
        </Button>
      </div>
    </Tile>
  );
}

function OracleDownloadLink({
  href,
  icon: Icon,
  text,
  className
}: {
  href: string;
  icon: IconComponent;
  text: string;
  className?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <div
        className={cn(
          'flex cursor-pointer flex-row items-center gap-2 rounded-sm border bg-linear-to-b px-4.5 py-2.5 text-sm hover:to-60%',
          className
        )}
      >
        <Icon className="size-4 shrink-0" />
        {text}
      </div>
    </a>
  );
}

function OracleIndexTile({ className }: { className?: string }) {
  const t = useTranslations('HomePage');

  return (
    <Tile
      className={cn(className, 'bg-linear-to-b from-primary-alt via-primary-alt to-blue-950/15')}
      bodyClassName="p-0"
    >
      <div className="grid gap-4 md:grid-cols-[3fr_2fr] md:gap-6">
        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-semibold text-primary">
            <img src="/static/oracle_index_logo.png" className="mr-2 inline-block h-16" alt="Oracle Index Logo" />
            {t('oracle.title')}
          </h3>
          <p className="text-sm text-secondary">{t('oracle.desc')}</p>

          <div className="mt-auto flex flex-row flex-wrap items-center gap-3 pt-2">
            <OracleDownloadLink
              href={ORACLE_INDEX_LINKS.curseforge}
              icon={CurseForgeColorIcon}
              text="CurseForge"
              className="border-brand-curseforge/40 from-primary to-brand-curseforge/30 dark:to-brand-curseforge/20"
            />
            <OracleDownloadLink
              href={ORACLE_INDEX_LINKS.modrinth}
              icon={ModrinthIcon}
              text="Modrinth"
              className="border-brand-modrinth/40 from-primary to-brand-modrinth/30 dark:to-brand-modrinth/20 [&>svg]:text-brand-modrinth"
            />
          </div>
        </div>

        <a
          href={ORACLE_INDEX_LINKS.modrinth}
          target="_blank"
          rel="noopener noreferrer"
          className="overflow-hidden border border-tertiary"
        >
          <img
            src="/static/oracle_index_preview.jpg"
            alt="Oracle Index in-game documentation preview"
            width={1400}
            height={778}
            className="h-full w-full object-cover"
          />
        </a>
      </div>
    </Tile>
  );
}

function BlogTile({ className }: { className?: string }) {
  const t = useTranslations('HomePage');
  const blogPosts = allBlogs.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date))).slice(0, 3);

  return (
    <Tile title={t('blog.title')} className={className}>
      <ul className="my-auto flex flex-col divide-y divide-tertiary">
        {blogPosts.map((post) => (
          <li key={post._id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
            <div className="flex flex-row items-baseline justify-between gap-3">
              <NavLink
                href={`/blog/${post._id.replace('.mdx', '')}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {post.title}
              </NavLink>

              <span className="shrink-0 text-sm text-secondary">{format(new Date(post.date), 'MMM d, yyyy')}</span>
            </div>

            <p className="line-clamp-2 text-sm text-secondary">{post.excerpt}</p>
          </li>
        ))}
      </ul>

      <div className="mt-auto ml-auto">
        <TileLink href="/blog" external>
          {t('blog.all')}
        </TileLink>
      </div>
    </Tile>
  );
}

function AboutTile({ className }: { className?: string }) {
  const t = useTranslations('HomePage');

  return (
    <Tile
      title={t('about.title')}
      className={className}
      bodyClassName="md:flex-row md:items-center md:justify-between md:gap-8"
    >
      <div className="flex flex-col gap-2 text-sm text-secondary md:max-w-3xl">
        <p>
          {t.rich('about.maintainers', {
            b: (chunks: any) => <b className="text-primary">{chunks}</b>
          })}
        </p>
        <p>{t('about.mission')}</p>
      </div>
      <div className="flex shrink-0 flex-row items-end justify-end sm:h-full">
        <SocialButtons large />
      </div>
    </Tile>
  );
}

function SponsorBanner() {
  const partnerUrl = process.env.PARTNER_URL;
  const bannerUrl = process.env.PARTNER_BANNER_URL;
  if (!partnerUrl || !bannerUrl) return null;

  return (
    <section className="mb-3 flex flex-col justify-center gap-2">
      <a
        href={partnerUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block w-full overflow-hidden rounded-sm border-tertiary transition-opacity hover:opacity-90"
      >
        <img
          className="mx-auto"
          src={bannerUrl}
          alt="CreeperHost: Buy a server today and it will directly support this creator"
        />
      </a>
    </section>
  );
}

function Hero() {
  const t = useTranslations('HomePage');

  return (
    <section className="flex flex-col items-center gap-4 py-8 text-center">
      <h1 className="flex flex-col items-center gap-3 text-lg text-secondary">
        {t.rich('title', {
          highlight: (chunks: any) => (
            <span
              className={cn(
                'bg-clip-text text-4xl font-bold text-transparent sm:text-5xl',
                'bg-linear-to-b from-blue-600 to-cyan-500',
                'dark:from-blue-500 dark:to-cyan-400'
              )}
            >
              {chunks}
            </span>
          )
        })}
      </h1>

      <p className="text-base text-secondary sm:text-lg">{t('subtitle')}</p>

      <div className="mt-2 flex flex-row flex-wrap justify-center gap-3">
        <Button asChild className="gap-2 border-none bg-contrast text-white hover:bg-contrast-hover">
          <LocaleNavLink href="/browse">
            <SearchIcon className="size-4" />
            {t('browse')}
          </LocaleNavLink>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <a href={WIKI_DOCS_URL}>
            <PencilRulerIcon className="size-4" />
            {t('guide')}
          </a>
        </Button>
      </div>
    </section>
  );
}

function HomePageContent({ projects }: { projects: FeaturedProject[] }) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 sm:px-6">
      <Hero />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PopularWikisTile projects={projects} className="lg:col-span-3" />

        <OracleIndexTile className="lg:col-span-3" />

        <BlogTile className="lg:col-span-2" />
        <AuthorsTile />

        <AboutTile className="lg:col-span-3" />
      </div>

      <SponsorBanner />
    </main>
  );
}

export default async function Home(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setContextLocale(params.locale);

  const projects = await featuredProjects.getFeaturedProjects();
  const showBanner =
    params.locale !== DEFAULT_LOCALE && (await crowdin.getCrowdinTranslationStatus(params.locale)) < 50;

  return (
    <>
      {showBanner && env.getCrowdinUrl() && (
        <div className="page-wrapper-base page-wrapper mx-auto mt-5 w-full max-w-5xl px-5">
          <TranslateBanner locale={params.locale} />
        </div>
      )}

      <div
        className={cn(
          showBanner && 'pt-0!',
          'page-wrapper-base page-wrapper sm:page-wrapper-ext flex min-h-screen flex-1 sm:mx-2'
        )}
      >
        <HomePageContent projects={projects} />
      </div>
    </>
  );
}
