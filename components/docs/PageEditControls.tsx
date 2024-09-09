import LinkTextButton from "@/components/ui/link-text-button";
import {FlagIcon, SquarePenIcon} from "lucide-react";
import dynamic from "next/dynamic";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {Link} from "@/lib/locales/routing";

const LocalDateTime = dynamic(() => import("@/components/util/LocalDateTime"), {ssr: false})

export default function PageEditControls({edit_url, updated_at, slug, path}: { edit_url: string | null, updated_at: Date | null, slug: string, path: string[] }) {
  return (
    <div className="mt-auto">
      <hr className="mt-4 mb-2 border-neutral-600"/>

      <div className="px-1 py-2 pb-0 flex flex-col items-start gap-3">
        {edit_url &&
            <LinkTextButton href={edit_url} target="_blank">
                <SquarePenIcon className="mr-2 w-4 h-4"/>
                Edit page on GitHub
            </LinkTextButton>
        }

        <Button asChild variant="ghost" size="sm" className="p-0 text-muted-foreground hover:bg-transparent h-fit font-normal">
          <Link href={`/report?slug=${slug}&path=${path.join('/')}`}>
            <FlagIcon className="w-4 h-4 mr-2"/>
            Report this page
          </Link>
        </Button>

        {updated_at &&
            <span className="text-muted-foreground text-sm">Last updated: <LocalDateTime dateTime={updated_at}/></span>}
      </div>
    </div>
  )
}