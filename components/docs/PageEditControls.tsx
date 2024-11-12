import LinkTextButton from "@/components/ui/link-text-button";
import {FlagIcon, SquarePenIcon} from "lucide-react";
import dynamic from "next/dynamic";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {Link} from "@/lib/locales/routing";
import localPreview from "@/lib/docs/localPreview";
import {useTranslations} from "next-intl";

const LocalDateTime = dynamic(() => import("@/components/util/LocalDateTime"), {ssr: false})

export default function PageEditControls({edit_url, updated_at, slug, path}: { edit_url?: string, updated_at?: Date, slug: string, path: string[] }) {
  const preview = localPreview.isEnabled();
  const t = useTranslations('PageEditControls');

  return (
    <div className="mt-auto pt-3">
      <hr className="mt-4 mb-2"/>

      <div className="px-1 py-2 pb-0 flex flex-col items-start gap-3">
        {edit_url &&
            <LinkTextButton href={edit_url} target="_blank">
                <SquarePenIcon className="mr-2 w-4 h-4"/>
                {t('edit_gh')}
            </LinkTextButton>
        }

        {!preview &&
            <Button asChild variant="ghost" size="sm" className="p-0 text-muted-foreground hover:bg-transparent h-fit font-normal">
                <Link href={`/report?slug=${slug}&path=${path.join('/')}`}>
                    <FlagIcon className="w-4 h-4 mr-2"/>
                    {t('report')}
                </Link>
            </Button>
        }

        {updated_at &&
            <span className="text-muted-foreground text-sm">{t.rich('last_updated', {
              date: (chunks) => <LocalDateTime dateTime={updated_at}/>
            })}</span>}
      </div>
    </div>
  )
}