import {setContextLocale} from "@/lib/locales/routing";
import service, {Project, RenderedDocsPage} from "@/lib/service";
import DocsPageNotFoundError from "@/components/docs/DocsPageNotFoundError";
import {redirect} from "next/navigation";
import DocsLoadingSkeleton from "@/components/docs/body/DocsLoadingSkeleton";
import DocsEntryPage from "@/components/docs/body/DocsEntryPage";
import {Suspense} from "react";
import ImageWithFallback from "@/components/util/ImageWithFallback";
import EntryDetails from "@/components/docs/util/EntryDetails";
import MetadataGrid from "@/components/docs/util/MetadataGrid";
import MetadataRowKey from "@/components/docs/util/MetadataRowKey";
import {cn} from "@/lib/utils";
import {DocsEntryMetadata} from "@/lib/docs/metadata";
import {AssetLocation} from "@/lib/assets";
import {getMessages, getTranslations} from "next-intl/server";
import DocsContentTOCSidebar from "@/components/docs/side/DocsContentTOCSidebar";
import {pick} from "lodash";
import {NextIntlClientProvider} from "next-intl";
import ContentListFooter from "@/components/docs/ContentListFooter";

interface Props {
  params: {
    slug: string;
    version: string;
    locale: string;
    id: string;
  };
}

async function RightSidebar({title, project, metadata, version}: {
  title: string;
  project: Project;
  metadata: DocsEntryMetadata;
  version: string;
}) {
  const iconUrl: AssetLocation | null = metadata.hide_icon === true || !metadata.icon && !metadata.id ? null : await service.getAsset(project.id, (metadata.icon || metadata.id)!, version);

  return (
    <div
      className={cn('h-full p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-secondary/20')}>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-secondary">
          {title}
        </h3>
      </div>

      <div className="mb-6 border border-tertiary m-2 rounded-sm">
        <ImageWithFallback src={iconUrl?.src} width={112} height={112}
                           className="docsContentIcon m-4 mx-auto disable-blur"
                           alt={!iconUrl ? undefined : iconUrl.id}/>
      </div>
      {metadata.title &&
        <h1 className="text-center text-lg text-primarys font-semibold">
          {metadata.title}
        </h1>
      }

      <EntryDetails className="pb-2 text-center">
        {metadata.id &&
          <code className="text-center text-secondary break-all">{metadata.id}</code>
        }
      </EntryDetails>

      <MetadataGrid>
        {metadata.custom && Object.entries(metadata.custom).map(e => (
          <MetadataRowKey key={e[0]} title={e[0]}>{e[1]}</MetadataRowKey>
        ))}
      </MetadataGrid>
    </div>
  )
}

export default async function ContentEntryPage({params}: Props) {
  setContextLocale(params.locale);
  const id = decodeURIComponent(params.id);

  let page: RenderedDocsPage | null;
  try {
    // TODO version and locale
    page = await service.renderProjectContentPage(params.slug, id);
  } catch (e) {
    console.error('FATAL error rendering content page', e);
    return (
      <DocsPageNotFoundError />
    );
  }
  if (!page) redirect(`/project/${params.slug}/content`);

  const t = await getTranslations('DocsContentRightSidebar');
  const messages = await getMessages();

  const contents = await service.getProjectContents(params.slug);

  return (
    <div className="relative w-full mx-auto flex flex-row justify-center gap-4 ml-auto mt-2 mb-12">
      <div className="w-64 shrink-0">
        <NextIntlClientProvider messages={pick(messages, 'DocsNonContentRightSidebar')}>
          <DocsContentTOCSidebar headings={page.content.metadata._headings || []} />
        </NextIntlClientProvider>
      </div>
      <div className="max-w-[1072px] w-full px-6">
        <Suspense fallback={<DocsLoadingSkeleton/>}>
          <DocsEntryPage page={page}/>
        </Suspense>

        {contents && <ContentListFooter project={page.project} contents={contents} version={params.version} />}
      </div>
      <div className="w-64 shrink-0">
        <RightSidebar title={t('title')} project={page.project}
                      metadata={page.content.metadata}
                      version={params.version}/>
      </div>
    </div>
  )
}