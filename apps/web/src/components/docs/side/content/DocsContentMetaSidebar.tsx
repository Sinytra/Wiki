import { cn } from '@repo/ui/lib/utils';
import ContentInfobox, { Props as BodyProps } from './ContentInfobox';
import { RenderedDocsPage } from '@repo/shared/types/service';

type Props = Omit<BodyProps, 'frontmatter' | 'metadata' | 'properties' | 'links'> & {
  title: string;
  page: RenderedDocsPage;
  className?: string;
};

export default function DocsContentMetaSidebar(props: Props) {
  return (
    <aside
      className={cn(
        'not-prose flex shrink-0 flex-col',
        'scrollbar-thumb-secondary scrollbar-track-secondary/20 scrollbar-thin space-y-2 overflow-y-auto',
        'float-right clear-right wide-layout:float-none wide-layout:clear-none',
        'pb-6 sm:mb-4 sm:ml-4 sm:w-72 sm:pb-0 wide-layout:m-0 wide-layout:w-80 wide-layout:p-4',
        props.className
      )}
    >
      <div className="mb-4 hidden items-center justify-between wide-layout:flex">
        <h3 className="text-sm font-semibold text-secondary">{props.title}</h3>
      </div>

      {props.page.frontmatter.infobox != null && (
        <ContentInfobox
          project={props.project}
          ctx={props.ctx}
          metadata={props.page.frontmatter.infobox}
          frontmatter={props.page.frontmatter}
          properties={props.page.properties}
          links={props.page.links}
        />
      )}
    </aside>
  );
}
