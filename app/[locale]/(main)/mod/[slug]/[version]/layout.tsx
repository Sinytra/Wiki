import ModDocsBaseLayout from "@/components/docs/layout/ModDocsBaseLayout";
import DocsTree from "@/components/docs/tree/DocsTree";
import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import {FileQuestionIcon, HouseIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import GitHubIcon from "@/components/ui/icons/GitHubIcon";
import {NavLink} from "@/components/navigation/link/NavLink";
import {ErrorBoundary} from "react-error-boundary";
import {useTranslations} from "next-intl";
import PrimaryButton from "@/components/ui/custom/PrimaryButton";
import {redirect} from "next/navigation";
import service from "@/lib/service";

export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

function getIssueCreationLink(repo: any) {
  return `https://github.com/${repo}/issues/new`;
}

function DocsPageNotFoundError({issueURL}: { issueURL?: string }) {
  const t = useTranslations('DocsPageNotFoundError');

  return (
    <div className="m-auto p-4 flex flex-col gap-4 justify-center items-center">
      <FileQuestionIcon className="w-32 h-32 sm:w-48 sm:h-48" strokeWidth={1.5}/>

      <h1 className="text-foreground text-3xl sm:text-5xl my-2">
        {t('title')}
      </h1>

      <p className="text-muted-foreground text-center w-3/4 sm:w-full">
        {t('desc')}
      </p>
      <p className="text-muted-foreground text-center w-3/4 sm:w-full">
        {t('suggestion')}
      </p>

      <div className="inline-flex gap-4 mt-4">
        {issueURL &&
            <Button variant="secondary" asChild>
                <Link href={issueURL} target="_blank">
                    <GitHubIcon className="mr-2 w-4 h-4"/>
                    {t('submit')}
                </Link>
            </Button>
        }
        <PrimaryButton asChild>
          <NavLink href="/">
            <HouseIcon className="mr-2 w-4 h-4" strokeWidth={2.5} />
            {t('return')}
          </NavLink>
        </PrimaryButton>
      </div>
    </div>
  )
}

export default async function ModLayout({children, params}: Readonly<{
  children: ReactNode;
  params: { slug: string; version: string; locale: string }
}>) {
  setContextLocale(params.locale);

  const data = await service.getBackendLayout(params.slug, params.version, params.locale);
  if (!data) redirect('/');

  return (
    <ErrorBoundary fallback={<DocsPageNotFoundError issueURL={data.mod.is_public ? getIssueCreationLink(data.mod.source_repo) : undefined}/>}  >
      <ModDocsBaseLayout leftPanel={<DocsTree slug={params.slug} tree={data.tree} version={params.version} />}>
        {children}
      </ModDocsBaseLayout>
    </ErrorBoundary>
  )
}