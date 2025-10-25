import {Link, setContextLocale} from "@/lib/locales/routing";
import {parseAsInteger, parseAsString} from "nuqs/server";
import {DEFAULT_DOCS_VERSION} from "@repo/shared/constants";
import {getTranslations} from "next-intl/server";
import DevProjectItemsTable from "@/components/dashboard/dev/table/DevProjectItemsTable";
import {BreadcrumbLink, BreadcrumbPage} from "@repo/ui/components/breadcrumb";
import DevBreadcrumb from "@/components/dashboard/dev/navigation/DevBreadcrumb";
import {handleApiCall} from "@/lib/service/serviceUtil";
import devProjectApi from "@/lib/service/api/devProjectApi";

type Properties = {
  params: Promise<{
    locale: string;
    project: string;
    tag: string;
  }>;
  searchParams: Promise<{
    query?: string | string[];
    page?: string | string[];
    version?: string;
  }>
}

export default async function DevProjectContentTagItemsPage(props: Properties) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectContentTagsPage');
  const project = handleApiCall(await devProjectApi.getProject(params.project));

  const tag = decodeURIComponent(params.tag);
  const query = parseAsString.withDefault('').parseServerSide(searchParams.query);
  const version = parseAsString.parseServerSide(searchParams.version);
  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  const content = handleApiCall(await devProjectApi.getProjectContentTagItems(params.project, tag, {query, page: page.toString(), version}));

  return (
    <div>
      <DevBreadcrumb home={
        <BreadcrumbLink asChild>
          <Link href={`/dev/project/${params.project}/content/tags`}>
            {t('title')}
          </Link>
        </BreadcrumbLink>
      }>
        <BreadcrumbPage className="font-mono text-xsm text-primary">
          {tag}
        </BreadcrumbPage>
      </DevBreadcrumb>

      <DevProjectItemsTable data={content}
                            versions={project.versions || []}
                            ctx={{locale: params.locale, id: params.project, version: DEFAULT_DOCS_VERSION}}
                            page={page}
      />
    </div>
  )
}
