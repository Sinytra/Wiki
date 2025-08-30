import {cn} from "@repo/ui/lib/utils";
import DocsContentMetaSidebarBody, {
  Props as BodyProps
} from "@/components/docs/side/content/DocsContentMetaSidebarBody";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import env from "@repo/shared/env";
import ReportPageButton from "@/components/docs/layout/ReportPageButton";
import EditPageButton from "@/components/docs/layout/EditPageButton";
import {RenderedDocsPage} from "@repo/shared/types/service";

type Props = Omit<BodyProps, 'project' | 'metadata' | 'properties'> & { id: string; page: RenderedDocsPage };

export default function DocsContentMetaSidebar(props: Props) {
  return (
    <aside
      className={cn(
        'shrink-0',
        'hidden flex-col sm:flex sm:w-80',
        'scrollbar-thumb-secondary scrollbar-track-secondary/20 scrollbar-thin space-y-2 overflow-y-auto p-4 pb-6'
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-secondary">
          {props.title}
        </h3>
      </div>

      <DocsContentMetaSidebarBody project={props.page.project} metadata={props.page.content.metadata}
                                  properties={props.page.properties} {...props}/>

      <ClientLocaleProvider keys={['PageEditControls']}>
        <div className="mt-auto space-y-4 pb-7">
          <hr className="pb-4"/>

          <EditPageButton editUrl={props.page.edit_url}/>

          <ReportPageButton full project={props.page.project.id} path={[props.id]}
                            preview={env.isPreview()}/>
        </div>
      </ClientLocaleProvider>
    </aside>
  )
}
