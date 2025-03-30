import {Link, setContextLocale} from "@/lib/locales/routing";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import {NuqsAdapter} from "nuqs/adapters/next/app";
import {parseAsInteger, parseAsString} from "nuqs/server";
import {DEFAULT_DOCS_VERSION} from "@/lib/constants";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {pick} from "lodash";
import DevProjectItemsTable from "@/components/dev/content/DevProjectItemsTable";
import {BreadcrumbLink, BreadcrumbPage} from "@/components/ui/breadcrumb";
import DevBreadcrumb from "@/components/dev/DevBreadcrumb";

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

export default async function ProjectDevContentTagItemsPage({params, searchParams}: Properties) {
  setContextLocale(params.locale);

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

  const messages = await getMessages();

  return (
    <div>
      <DevBreadcrumb home={
        <BreadcrumbLink asChild>
          <Link href={`/dev/project/${params.project}/content/tags`}>
            Tags
          </Link>
        </BreadcrumbLink>
      }>
        <BreadcrumbPage className="font-mono text-xsm text-primary">
          {tag}
        </BreadcrumbPage>
      </DevBreadcrumb>

      <NuqsAdapter>
        <NextIntlClientProvider messages={pick(messages, 'DocsVersionSelector')}>
          <DevProjectItemsTable data={content}
                                versions={project.versions || []}
                                params={{locale: params.locale, slug: params.project, version: DEFAULT_DOCS_VERSION}}
          />
        </NextIntlClientProvider>
      </NuqsAdapter>
    </div>
  )
}
