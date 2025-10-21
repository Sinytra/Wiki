'use client'

import {TvMinimalPlayIcon} from "lucide-react";
import {Button} from "@repo/ui/components/button";
import {cn} from "@repo/ui/lib/utils";
import {ReactNode, useContext} from "react";
import {
  CATEGORY_EXPERIENCE,
  CookieConsentContext,
  EMBED_SERVICE_COOKIES
} from "@/components/cookies/CookieConsentContextProvider";
import * as CookieConsent from "vanilla-cookieconsent";
import {useTranslations} from "next-intl";

export default function VideoEmbedPlaceholder({id, children}: {
  id: string;
  children: ReactNode
}) {
  const t = useTranslations('VideoEmbedPlaceholder');
  const context = useContext(CookieConsentContext)!;
  if (!context.enableCookieManagement || context?.hasConsentToEmbeddedVideos) {
    return children;
  }
  const videoId = id && id.includes('?') ? id.split('?')[0] : id;

  function acceptService() {
    CookieConsent.acceptService(EMBED_SERVICE_COOKIES, CATEGORY_EXPERIENCE);
  }

  return (
    <div className={cn(`
      video-embed flex flex-col items-center justify-center gap-5 rounded-sm border border-tertiary bg-primary-alt p-4
      text-center
    `)}>
      <TvMinimalPlayIcon className="size-12 text-secondary-alt" strokeWidth={1.5}/>
      <div className="text-xl">
        <div className="flex flex-col gap-1">
          <span>{t('title')}</span>
          <span className="text-sm text-secondary">{t('description')}</span>
        </div>
      </div>
      <div className="mt-2 flex flex-row flex-wrap justify-center gap-3">
        <Button onClick={() => acceptService()}>
          {t('accept')}
        </Button>
        {videoId && (
          <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noreferrer">
            <Button variant="outline">
              {t('watch')}
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}