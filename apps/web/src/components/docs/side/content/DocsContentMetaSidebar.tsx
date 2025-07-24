import {cn} from "@repo/ui/lib/utils";
import DocsContentMetaSidebarBody, {Props} from "@/components/docs/side/content/DocsContentMetaSidebarBody";

export default function DocsContentMetaSidebar(props: Props) {
  return (
    <aside
      className={cn(
        'right-0 shrink-0',
        'hidden sm:block sm:w-80',
        'scrollbar-thumb-secondary scrollbar-track-secondary/20 scrollbar-thin h-full space-y-2 overflow-y-auto p-4'
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-secondary">
          {props.title}
        </h3>
      </div>

      <DocsContentMetaSidebarBody {...props}/>
    </aside>
  )
}
