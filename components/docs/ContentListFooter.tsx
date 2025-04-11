import {ProjectContentEntry, ProjectContentTree} from "@/lib/service/types";
import {Project} from "@/lib/service";
import ExpandableCategory from "@/components/docs/util/ExpandableCategory";
import Asset from "@/components/docs/shared/Asset";
import PageLink from "@/components/docs/PageLink";
import {Link} from "@/lib/locales/routing";

function Category({content, slug, version}: { content: ProjectContentEntry; slug: string; version: string }) {
  let subCategories: ProjectContentTree;
  if (content.children.some(c => c.type === 'dir')) {
    subCategories = content.children.filter(c => c.type === 'dir');
    const other = content.children.filter(c => c.type == 'file');
    if (other.length > 0) {
      subCategories.push({name: 'Other', children: other, type: 'dir', path: ''});
    }
  } else {
    subCategories = [{name: 'All', children: content.children, type: 'dir', path: ''}];
  }

  return (
    <ExpandableCategory name={content.name}>
      {subCategories.map(i => (
        <div key={i.path} className="bg-primary-dark! flex flex-col sm:flex-row sm:items-center gap-2 p-2 first:rounded-t-sm last:rounded-b-sm">
          <div className="sm:w-[1%] sm:min-w-24 text-sm text-right font-medium self-center">
            {i.name}
          </div>
          <div className="columns-[10em] space-y-2 sm:space-y-0 sm:flex flex-row flex-wrap gap-2">
            {...i.children.map((c,i) => (
              <div key={c.path} className="flex flex-row gap-1 items-center text-sm">
                {i > 0 && <span className="text-secondary hidden sm:block">&bull;</span>}
                <PageLink href={`/project/${slug}/${version}/content/${c.id}`} local
                          className="flex flex-row gap-1 items-center !text-sm">
                  <Asset location={c.id!} />
                  {c.name}
                </PageLink>
              </div>
            ))}
          </div>
        </div>
      ))}
    </ExpandableCategory>
  )
}

export default function ContentListFooter({project, contents, version}: { project: Project, contents: ProjectContentTree; version: string }) {
  return (
    <div className="not-prose">
      <hr className="mb-8"/>

      <div className="p-2">
        <table className="w-full [&_td]:border-none [&_tr]:bg-primary-dim border-separate bg-primary-dim rounded-sm p-2.5 border border-tertiary">
          <thead className="table w-full mb-2">
          <tr>
            <th colSpan={2} className="rounded-sm p-2 bg-secondary">
              <Link className="hover:underline underline-offset-4 hover:text-primary/80!"
                    href={`/project/${project.id}/${version}`}
              >
                {project.name}
              </Link>
              <span className="float-right min-w-[1em]">&nbsp;</span>
            </th>
          </tr>
          </thead>
          <tbody className="table w-full">
          {...contents.map(c => (
            <Category key={c.path} content={c} slug={project.id} version={version}/>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}