import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@repo/ui/components/breadcrumb";
import {SidebarTrigger} from "@repo/ui/components/sidebar";

export default function DevBreadcrumb({home, children}: { home: any; children?: any }) {
  return (
    <Breadcrumb className="mt-1 mb-4 sm:mt-0">
      <BreadcrumbList>
        <SidebarTrigger className="text-primary mr-1 -ml-1 sm:hidden"/>
        <BreadcrumbItem>
          {home}
        </BreadcrumbItem>
        <BreadcrumbSeparator/>
        {children}
      </BreadcrumbList>
    </Breadcrumb>
  )
}