import {notFound, redirect} from "next/navigation";
import Asset from "@/components/docs/shared/Asset";
import {ProjectContentEntry, ProjectContentTree} from "@/lib/service/types";
import PageLink from "@/components/docs/PageLink";
import service from "@/lib/service";
import {setContextLocale} from "@/lib/locales/routing";
import platforms from "@/lib/platforms";
import DocsSubpageTitle from "@/components/docs/layout/DocsSubpageTitle";

interface Props {
  params: {
    slug: string;
    version: string;
    locale: string;
  };
}

function ContentEntryLink({entry, slug, version}: { entry: ProjectContentEntry; slug: string; version: string }) {
  if (entry.type != 'file') {
    throw new Error('Bug? Unexpected ContentEntryLink entry type ' + entry.type);
  }

  return (
    <div>
      <PageLink href={`/project/${slug}/${version}/content/${entry.id}`} local
                className="flex flex-row gap-1 items-center !text-sm">
        <Asset location={entry.id!}/>
        {entry.name}
      </PageLink>
    </div>
  )
}

function ContentEntryList({entries, slug, version}: { entries: ProjectContentTree; slug: string; version: string }) {
  return (
    <div className="columns-[10em] space-y-2 sm:space-y-0 w-full sm:w-fit sm:flex flex-row flex-wrap gap-1 items-center">
      {...entries.filter(c => c.type === 'file').map((c, i) =>
        <div key={c.path} className="flex flex-row flex-wrap gap-1 items-center">
          {i > 0 && <span className="text-secondary hidden sm:block">&bull;</span>}
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
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center">
      <div className="sm:w-24 shrink-0 text-end">
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

  const enableCategories = entry.children.some(c => c.type === 'dir');
  const children = entry.children.filter(c => c.type == 'file');

  if (!enableCategories && children.length === 0) {
    return null;
  }

  return (
    <div className="bg-primary-alt/50">
      <div className="px-3 py-2 flex flex-col gap-2 border border-secondary-dim rounded-sm">
        <span className="text-lg font-medium border-b border-tertiary pb-1">
          {entry.name}
        </span>
        {enableCategories
          ?
          <div className="flex flex-col gap-1">
            {...entry.children.filter(c => c.type === 'dir').map(c => (
              <ContentSubcategory key={c.path} entry={c} slug={slug} version={version}/>
            ))}
            {children.length > 0 &&
              <ContentSubcategory entry={{name: 'Other', children, type: 'dir', path: ''}}
                                  slug={slug} version={version}/>
            }
          </div>
          :
          <ContentSubcategory entry={{name: 'All', children, type: 'dir', path: ''}}
                              slug={slug} version={version}/>
        }
      </div>
    </div>
  )
}

export default async function ProjectContentPage({params}: Props) {
  setContextLocale(params.locale);

  const projectData = await service.getBackendLayout(params.slug, params.version, params.locale);
  if (!projectData) {
    return redirect('/');
  }
  const {project} = projectData;

  const platformProject = await platforms.getPlatformProject(project);

  const contents = await service.getProjectContents(params.slug, params.version, params.locale);
  if (!contents) {
    notFound();
  }

  return (
    <div className="max-w-5xl w-full mx-auto flex flex-col gap-6 mt-1 mb-5">
      <DocsSubpageTitle
        title={project.name}
        description={platformProject.summary}
        icon_url={platformProject.icon_url}
        subcategory="Content"
      />

      <div className="flex flex-col gap-4">
        {...contents.map(e =>
          (<ContentCategory key={e.path} slug={params.slug} version={params.version} entry={e}/>))
        }
      </div>
    </div>
  )
}