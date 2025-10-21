'use client'

import React, {createContext, useEffect, useState} from "react";

import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";
import cookies from "@/lib/cookies";
import {useTranslations} from "next-intl";

export interface CookieConsentData {
  enableCookieManagement: boolean;
  hasConsentToEmbeddedVideos: boolean;
}

export const CookieConsentContext = createContext<CookieConsentData | null>(null);

export const CATEGORY_EXPERIENCE = 'experience';
export const EMBED_SERVICE_COOKIES = 'yt_embeds';

export default function CookieConsentContextProvider({children}: { children?: React.ReactNode }) {
  const [enableCookieManagement, setEnableCookieManagement] = useState<boolean>(true);
  const [embeddedConsent, setEmbeddedConsent] = useState(false);
  const t = useTranslations('CookieConsent');

  function updateEmbeddedConsent() {
    setEmbeddedConsent(CookieConsent.acceptedService(EMBED_SERVICE_COOKIES, CATEGORY_EXPERIENCE));
  }

  useEffect(() => {
    const enableCookies = cookies.userRequiresCookieConsent();
    setEnableCookieManagement(enableCookies);

    if (!enableCookies) {
      return;
    }

    CookieConsent.run({
      revision: 1,

      guiOptions: {
        consentModal: {
          layout: 'box inline'
        }
      },

      onFirstConsent: () => {
        updateEmbeddedConsent();
      },

      onChange: () => {
        updateEmbeddedConsent();
      },

      categories: {
        necessary: {
          enabled: true,
          readOnly: true
        },
        [CATEGORY_EXPERIENCE]: {
          services: {
            [EMBED_SERVICE_COOKIES]: {
              label: t('sections.experience.services.embeds'),
              onAccept: () => setEmbeddedConsent(true),
              onReject: () => setEmbeddedConsent(false)
            }
          }
        }
      },

      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: t('popup.title'),
              description: t('popup.description'),
              acceptAllBtn: t('actions.accept_all'),
              acceptNecessaryBtn: t('actions.reject_all'),
              showPreferencesBtn: t('popup.show_preferences')
            },
            preferencesModal: {
              title: t('modal.title'),
              acceptAllBtn: t('actions.accept_all'),
              acceptNecessaryBtn: t('actions.reject_all'),
              savePreferencesBtn: t('modal.save'),
              closeIconLabel: t('modal.close'),
              sections: [
                {
                  title: t('sections.summary.title'),
                  description: t('sections.summary.description')
                },
                {
                  title: t('sections.necessary.title'),
                  description: t('sections.necessary.description'),
                  linkedCategory: 'necessary'
                },
                {
                  title: t('sections.experience.title'),
                  description: t('sections.experience.description'),
                  linkedCategory: 'experience'
                },
                {
                  title: t('sections.more_info.title'),
                  description: t.raw('sections.more_info.description')
                }
              ]
            }
          }
        }
      }
    });
  }, []);

  return (
    <CookieConsentContext.Provider value={{ enableCookieManagement, hasConsentToEmbeddedVideos: embeddedConsent }}>
      {children}
    </CookieConsentContext.Provider>
  );
}