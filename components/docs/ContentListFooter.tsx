import {ProjectContentEntry, ProjectContentTree} from "@/lib/service/types";
import {Project} from "@/lib/service";
import ExpandableCategory from "@/components/docs/util/ExpandableCategory";
import Asset from "@/components/docs/shared/Asset";
import PageLink from "@/components/docs/PageLink";

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
        <div key={i.path} className="bg-primary-dark! flex flex-row items-center gap-2 p-2 first:rounded-t-sm last:rounded-b-sm">
          <div className="w-[1%] min-w-24 text-sm text-right font-medium">
            {i.name}
          </div>
          <div className="flex flex-row flex-wrap gap-2">
            {...i.children.map((c,i) => (
              <div key={c.path} className="flex flex-row gap-1 items-center text-sm">
                {i > 0 && <span className="text-secondary">&bull;</span>}
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
    <div className="mt-20 not-prose">
      <hr className="mb-8"/>

      <table className="w-full [&_td]:border-none [&_tr]:bg-primary-dim border-separate bg-primary-dim rounded-sm p-2.5 border border-tertiary">
        <thead className="table w-full mb-2">
        <tr>
          <th colSpan={2} className="rounded-sm p-2 bg-secondary">
            {project.name}
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
  )
}