import {notFound, redirect} from "next/navigation";
import Asset from "@/components/docs/shared/Asset";
import {ProjectContentEntry} from "@/lib/service/types";
import PageLink from "@/components/docs/PageLink";
import service from "@/lib/service";
import {setContextLocale} from "@/lib/locales/routing";
import platforms from "@/lib/platforms";

interface Props {
  params: {
    slug: string;
    version: string;
    locale: string;
  };
}

// TODO Subcategories
function ContentCategory({entry, slug, version}: { entry: ProjectContentEntry; slug: string; version: string }) {
  return (
    <div className="bg-primary-alt/50">
      {entry.type == 'file' &&
        <PageLink href={`/project/${slug}/${version}/content/${entry.id}`} local className="flex flex-row gap-2 items-center !text-sm">
          <Asset location={entry.id!}/>
          {entry.name}
        </PageLink>
      }
      {entry.type == 'dir' &&
        <div className="px-3 py-2 flex flex-col gap-2 border border-secondary rounded-sm">
            <span className="text-lg font-medium border-b border-tertiary pb-1">
              {entry.name}
            </span>
            <div className="flex flex-row flex-wrap gap-2">
              {...entry.children.map(e =>
                (<ContentCategory key={e.path} slug={slug} version={version} entry={e}/>))
              }
            </div>
        </div>
      }
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

  const contents = await service.getProjectContents(params.slug);
  if (!contents) {
    notFound();
  }

  return (
    <div className="max-w-5xl w-full mx-auto flex flex-col gap-6 mt-1 mb-5">
      <div className="flex flex-row gap-4 border-b border-secondary pb-2">
        <div className="flex justify-center items-center">
          <img src={platformProject.icon_url} alt="Icon" className="w-14 h-14 rounded-sm flex-shrink-0"/>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-primary text-2xl">
            {project.name} <span className="text-secondary">/ Content</span>
          </h1>
          <blockquote className="text-secondary">
            {platformProject.summary}
          </blockquote>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {...contents.map(e =>
          (<ContentCategory key={e.path} slug={params.slug} version={params.version} entry={e}/>))
        }
      </div>
    </div>
  )
}