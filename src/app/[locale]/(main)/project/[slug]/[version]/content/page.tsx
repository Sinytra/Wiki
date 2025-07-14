import {notFound, redirect} from "next/navigation";
import Asset from "@/components/docs/shared/asset/Asset";
import PageLink from "@/components/docs/PageLink";
import service from "@/lib/service";
import {setContextLocale} from "@/lib/locales/routing";
import platforms from "@repo/platforms";
import DocsSubpageTitle from "@/components/docs/layout/DocsSubpageTitle";
import {ProjectContentEntry, ProjectContentTree} from "@repo/shared/types/service";
import {useTranslations} from "next-intl";

interface Props {
  params: Promise<{
    slug: string;
    version: string;
    locale: string;
  }>;
}

function ContentEntryLink({entry, slug, version}: { entry: ProjectContentEntry; slug: string; version: string }) {
  if (entry.type != 'file') {
    throw new Error('Bug? Unexpected ContentEntryLink entry type ' + entry.type);
  }

  return (
    <div>
      <PageLink href={`/project/${slug}/${version}/content/${entry.id}`} local
                className="flex flex-row items-center gap-1 !text-sm">
        <Asset location={entry.id!}/>
        {entry.name}
      </PageLink>
    </div>
  )
}

function ContentEntryList({entries, slug, version}: { entries: ProjectContentTree; slug: string; version: string }) {
  return (
    <div className="w-full columns-[10em] flex-row flex-wrap items-center gap-1 space-y-2 sm:flex sm:w-fit sm:space-y-0">
      {...entries.filter(c => c.type === 'file').map((c, i) =>
        <div key={c.path} className="flex flex-row flex-wrap items-center gap-1">
          {i > 0 && <span className="hidden text-secondary sm:block">&bull;</span>}
          <ContentEntryLink entry={c} slug={slug} version={version}/>
        </div>
      )}
    </div>
  )
}

function ContentSubcategory({entry, slug, version}: { entry: ProjectContentEntry; slug: string; version: string }) {
  if (entry.type != 'dir') {
    throw new Error('Bug? Unexpected ContentCategory entry type ' + entry.type);
  }

  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
      <div className="shrink-0 text-end sm:w-24">
        <span className="text-sm font-medium">{entry.name}</span>
      </div>
      <ContentEntryList entries={entry.children} slug={slug} version={version}/>
    </div>
  )
}

function ContentCategory({entry, slug, version}: { entry: ProjectContentEntry; slug: string; version: string }) {
  if (entry.type != 'dir') {
    throw new Error('Bug? Unexpected ContentCategory entry type ' + entry.type);
  }

  const t = useTranslations('ContentCategory');
  const enableCategories = entry.children.some(c => c.type === 'dir');
  const children = entry.children.filter(c => c.type == 'file');

  if (!enableCategories && children.length === 0) {
    return null;
  }

  return (
    <div className="bg-primary-alt/50">
      <div className="flex flex-col gap-2 rounded-sm border border-secondary-dim px-3 py-2">
        <span className="border-b border-tertiary pb-1 text-lg font-medium">
          {entry.name}
        </span>
        {enableCategories
          ?
          <div className="flex flex-col gap-1">
            {...entry.children.filter(c => c.type === 'dir').map(c => (
              <ContentSubcategory key={c.path} entry={c} slug={slug} version={version}/>
            ))}
            {children.length > 0 &&
              <ContentSubcategory entry={{name: t('other'), children, type: 'dir', path: ''}}
                                  slug={slug} version={version}/>
            }
          </div>
          :
          <ContentSubcategory entry={{name: t('all'), children, type: 'dir', path: ''}}
                              slug={slug} version={version}/>
        }
      </div>
    </div>
  )
}

export default async function ProjectContentPage(props: Props) {
  const {slug, version, locale} = await props.params;
  const ctx = {id: slug, version, locale};
  setContextLocale(locale);

  const projectData = await service.getBackendLayout(ctx);
  if (!projectData) {
    return redirect('/');
  }
  const {project} = projectData;

  const platformProject = await platforms.getPlatformProject(project);

  const contents = await service.getProjectContents(ctx);
  if (!contents) {
    notFound();
  }

  return (
    <div className="mx-auto mt-1 mb-5 flex w-full max-w-5xl flex-col gap-6">
      <DocsSubpageTitle
        title={project.name}
        description={platformProject.summary}
        icon_url={platformProject.icon_url}
        subcategory="Content"
      />

      <div className="flex flex-col gap-4">
        {...contents.map(e =>
          (<ContentCategory key={e.path} slug={slug} version={version} entry={e}/>))
        }
      </div>
    </div>
  )
}