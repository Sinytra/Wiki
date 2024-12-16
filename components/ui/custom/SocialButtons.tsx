"use client";

import { Share2 } from "lucide-react";
import { Button } from "../button";
import CurseForgeIcon from "../icons/CurseForgeIcon";
import DiscordIcon from "../icons/DiscordIcon";
import GitHubIcon from "../icons/GitHubIcon";
import ModrinthIcon from "../icons/ModrinthIcon";

export default function SocialButtons({ enableSharing, shareData }: { enableSharing: boolean, shareData?: any }) {
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

    return (
        <div className="flex flex-wrap gap-2 sm:gap-4">
            <SocialButton href="https://www.curseforge.com/members/su5ed/projects" icon={<CurseForgeIcon className="h-4 w-4 sm:h-5 sm:w-5" />} />
            <SocialButton href="https://modrinth.com/organization/sinytra" icon={<ModrinthIcon className="h-4 w-4 sm:h-5 sm:w-5" />} />
            <SocialButton href="https://github.com/Sinytra" icon={<GitHubIcon className="h-4 w-4 sm:h-5 sm:w-5" />} />
            <SocialButton href="https://discord.sinytra.org/" icon={<DiscordIcon className="h-4 w-4 sm:h-5 sm:w-5" />} />
            {enableSharing && isShareSupported && (
                <Button onClick={handleShare} size="sm" className="h-8 w-8 sm:h-10 sm:w-auto sm:px-4 flex items-center justify-center sm:justify-start gap-2">
                    <Share2 className="h-5 w-5" />
                    <span className="hidden sm:inline">Share</span>
                </Button>
            )}
        </div>
    );
}

export function SocialButton({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                {icon}
            </Button>
        </a>
    );
}