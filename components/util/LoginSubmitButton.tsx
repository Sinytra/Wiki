'use client'

import {useFormStatus} from "react-dom";
import {Button} from "@/components/ui/button";
import {LoaderCircleIcon} from "lucide-react";
import GitHubIcon from "@/components/ui/icons/GitHubIcon";

export default function LoginSubmitButton({ text }: { text: string }) {
  const {pending} = useFormStatus();

  return (
    <Button type="submit"
            variant="outline"
            disabled={pending}
            className="w-full gap-2 bg-black disabled:bg-neutral-950 disabled:opacity-70! transition-opacity opacity-90! hover:bg-neutral-950 hover:opacity-70! rounded-xs text-white">
      <div className="text-white">
        {pending
          ?
          <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin"/>
          :
          <GitHubIcon width={16} height={16}/>
        }
      </div>
      {text}
    </Button>
  );
}