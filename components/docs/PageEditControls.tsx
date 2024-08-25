import LinkTextButton from "@/components/ui/link-text-button";
import {SquarePenIcon} from "lucide-react";
import dynamic from "next/dynamic";

const LocalDateTime = dynamic(() => import("@/components/util/LocalDateTime"), {ssr: false})

export default function PageEditControls({edit_url, updated_at}: { edit_url: string | null, updated_at: Date | null }) {
  return (
    <div className="mt-auto">
      <hr className="my-2 border-neutral-600"/>

      <div className="px-1 py-2 pb-0 flex flex-col items-start gap-3">
        {edit_url &&
            <LinkTextButton href={edit_url} target="_blank">
                <SquarePenIcon className="mr-2 w-4 h-4"/>
                Edit page on GitHub
            </LinkTextButton>
        }

        {updated_at &&
            <span className="text-muted-foreground text-sm">Last updated: <LocalDateTime dateTime={updated_at}/></span>}
      </div>
    </div>
  )
}