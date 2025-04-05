import {setContextLocale} from "@/lib/locales/routing";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {redirect} from "next/navigation";
import {NuqsAdapter} from "nuqs/adapters/next/app";
import {parseAsInteger, parseAsString} from "nuqs/server";
import {DEFAULT_DOCS_VERSION} from "@/lib/constants";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {pick} from "lodash";
import DevProjectTagsTable from "@/components/dev/table/DevProjectTagsTable";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import * as React from "react";

type Properties = {
  params: {
    locale: string;
    project: string;
  };
  searchParams: {
    query?: string | string[];
    page?: string | string[];
    version?: string;
  }
}

export default async function ProjectDevContentTagsPage({params, searchParams}: Properties) {
  setContextLocale(params.locale);

  const project = await remoteServiceApi.getDevProject(params.project);
  if (!('id' in project)) {
    return redirect('/dev');
  }

  const query = parseAsString.withDefault('').parseServerSide(searchParams.query);
  const version = parseAsString.parseServerSide(searchParams.version);
  const page = parseAsInteger.withDefault(1).parseServerSide(searchParams.page);

  const content = await remoteServiceApi.getDevProjectContentTags(
    params.project,
    {query, page: page.toString(), version}
  );
  if ('status' in content) {
    return redirect('/dev');
  }

  const messages = await getMessages();

  return (
    <div className="pt-1 space-y-3">
      <DevProjectPageTitle title="Project tag" desc="Browse project tags" />

      <NuqsAdapter>
        <NextIntlClientProvider messages={pick(messages, 'DocsVersionSelector')}>
          <DevProjectTagsTable data={content}
                               versions={project.versions || []}
                               params={{locale: params.locale, slug: params.project, version: DEFAULT_DOCS_VERSION}}
                               page={page}
          />
        </NextIntlClientProvider>
      </NuqsAdapter>
    </div>
  )
}
