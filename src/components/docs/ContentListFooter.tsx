import ExpandableCategory from "@/components/docs/util/ExpandableCategory";
import Asset from "@/components/docs/shared/Asset";
import PageLink from "@/components/docs/PageLink";
import {Link} from "@/lib/locales/routing";
import {Project, ProjectContentEntry, ProjectContentTree} from "@repo/shared/types/service";
import {useTranslations} from "next-intl";

function Category({content, slug, version}: { content: ProjectContentEntry; slug: string; version: string }) {
  const t = useTranslations('ContentCategory');

  let subCategories: ProjectContentTree;
  if (content.children.some(c => c.type === 'dir')) {
    subCategories = content.children.filter(c => c.type === 'dir');
    const other = content.children.filter(c => c.type == 'file');
    if (other.length > 0) {
      subCategories.push({name: t('other'), children: other, type: 'dir', path: ''});
    }
  } else {
    subCategories = [{name: t('all'), children: content.children, type: 'dir', path: ''}];
  }

  return (
    <ExpandableCategory name={content.name}>
      {subCategories.map(i => (
        <div key={i.path} className={`
          flex flex-col gap-2 bg-primary-dark! p-2 first:rounded-t-sm last:rounded-b-sm sm:flex-row sm:items-center
        `}>
          <div className="self-center text-right text-sm font-medium sm:w-[1%] sm:min-w-24">
            {i.name}
          </div>
          <div className="columns-[10em] flex-row flex-wrap gap-2 space-y-2 sm:flex sm:space-y-0">
            {...i.children.map((c,i) => (
              <div key={c.path} className="flex flex-row items-center gap-1 text-sm">
                {i > 0 && <span className="hidden text-secondary sm:block">&bull;</span>}
                <PageLink href={`/project/${slug}/${version}/content/${c.id}`} local
                          className="flex flex-row items-center gap-1 !text-sm">
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
        <table className={`
          w-full border-separate rounded-sm border border-tertiary bg-primary-dim p-2.5 [&_td]:border-none
          [&_tr]:bg-primary-dim
        `}>
          <thead className="mb-2 table w-full">
          <tr>
            <th colSpan={2} className="rounded-sm bg-secondary p-2">
              <Link className="underline-offset-4 hover:text-primary/80! hover:underline"
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