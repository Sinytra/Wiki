"use client";

import {Share2} from "lucide-react";
import {ReactNode} from "react";
import {cn} from "@repo/ui/lib/utils";
import {Button} from "@repo/ui/components/button";
import GitHubIcon from "@repo/ui/icons/GitHubIcon";
import DiscordIcon from "@repo/ui/icons/DiscordIcon";

export default function SocialButtons({enableSharing, shareData, large}: {
  enableSharing?: boolean,
  shareData?: any;
  large?: boolean
}) {
  const isShareSupported = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share(shareData).catch((error) => {
        console.error("Error sharing:", error);
      });
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  const commonClass = large ? 'h-5 w-5' : 'h-4 w-4 sm:h-5 sm:w-5';

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4">
      <SocialButton href="https://github.com/Sinytra" large={large} icon={<GitHubIcon className={commonClass}/>}/>
      <SocialButton href="https://discord.sinytra.org" large={large} icon={<DiscordIcon className={commonClass}/>}/>
      {enableSharing && isShareSupported && (
        <Button onClick={handleShare} size="sm" className={`
          flex h-8 w-8 items-center justify-center gap-2 sm:h-10 sm:w-auto sm:justify-start sm:px-4
        `}>
          <Share2 className="h-5 w-5"/>
          <span className="hidden sm:inline">Share</span>
        </Button>
      )}
    </div>
  );
}

export function SocialButton({href, icon, large, className}: {
  href: string;
  icon: ReactNode;
  large?: boolean;
  className?: string
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Button variant="outline" size="icon" className={cn(className, large ? 'h-10 w-10' : `
              h-8 w-8 sm:h-10 sm:w-10
            `)}>
        {icon}
      </Button>
    </a>
  );
}