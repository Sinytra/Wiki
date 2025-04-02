import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {SidebarTrigger} from "@/components/ui/sidebar";

export default function DevBreadcrumb({home, children}: { home: any; children?: any }) {
  return (
    <Breadcrumb className="mt-1 sm:mt-0 mb-4">
      <BreadcrumbList>
        <SidebarTrigger className="-ml-1 mr-1 sm:hidden text-primary"/>
        <BreadcrumbItem>
          {home}
        </BreadcrumbItem>
        <BreadcrumbSeparator/>
        {children}
      </BreadcrumbList>
    </Breadcrumb>
  )
}