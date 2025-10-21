'use client'

import React, {useContext} from "react";
import {CookieConsentContext} from "@/components/cookies/CookieConsentContextProvider";
import {useTranslations} from "next-intl";

export default function ManageCookiesButton() {
  const t = useTranslations('ManageCookiesButton');
  const context = useContext(CookieConsentContext)!;
  if (!context.enableCookieManagement) {
    return null;
  }

  return (
    <button type="button" data-cc="show-preferencesModal" className="text-sm">
      {t('text')}
    </button>
  );
}