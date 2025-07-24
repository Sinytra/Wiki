'use client'

import React, {useState} from "react";
import {useTranslations} from "next-intl";

export default function UsageContentList({limit, content}: { limit: number; content: React.JSX.Element[]}) {
  const t = useTranslations('UsageContentList');
  const [expanded, setExpanded] = useState(false);

  return (
    <ul className="mt-0">
      {expanded ? content : content.slice(0, Math.min(limit, content.length))}
      {!expanded && content.length > limit &&
        <li className="text-secondary">
            <button className="decoration-1 underline-offset-4 hover:underline" onClick={() => setExpanded(true)}>
              {t('more')}
            </button>
        </li>
      }
    </ul>
  )
}