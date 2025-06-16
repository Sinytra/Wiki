import {Link, setContextLocale} from "@/lib/locales/routing";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import {parseAsInteger, parseAsString} from "nuqs/server";
import {DEFAULT_DOCS_VERSION} from "@repo/shared/constants";
import {getTranslations} from "next-intl/server";
import DevProjectItemsTable from "@/components/dev/table/DevProjectItemsTable";
import {BreadcrumbLink, BreadcrumbPage} from "@/components/ui/breadcrumb";
import DevBreadcrumb from "@/components/dev/navigation/DevBreadcrumb";

type Properties = {
  params: {
    locale: string;
    project: string;
    tag: string;
  };
  searchParams: {
    query?: string | string[];
    page?: string | string[];
    version?: string;
  }
}

export default async function DevProjectContentTagItemsPage({params, searchParams}: Properties) {
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectContentTagsPage');

  const project = await remoteServiceApi.getDevProject(params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }

  const tag = decodeURIComponent(params.tag);
  const query = parseAsString.withDefault('').parseServerSide(searchParams.query);
  const version = parseAsString.parseServerSide(searchParams.version);
  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  const content = await remoteServiceApi.getDevProjectContentTagItems(
    params.project,
    tag,
    {query, page: page.toString(), version}
  );
  if ('status' in content) {
    return redirect('/dev');
  }

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
                            params={{locale: params.locale, slug: params.project, version: DEFAULT_DOCS_VERSION}}
                            page={page}
      />
    </div>
  )
}
