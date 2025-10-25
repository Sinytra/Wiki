'use client'

import {useFormStatus} from "react-dom";
import {Button} from "@repo/ui/components/button";
import {LoaderCircleIcon} from "lucide-react";
import GitHubIcon from "@repo/ui/icons/GitHubIcon";

export default function LoginSubmitButton({text}: { text: string }) {
  const {pending} = useFormStatus();

  return (
    <Button type="submit"
            variant="outline"
            disabled={pending}
            className={`
              w-full gap-2 rounded-xs bg-black text-white opacity-90! transition-opacity hover:bg-neutral-950
              hover:opacity-70! disabled:bg-neutral-950 disabled:opacity-70!
            `}>
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