'use client'

import React, {useState} from "react";

export default function UsageContentList({limit, content}: { limit: number; content: React.JSX.Element[]}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <ul className="mt-0">
      {expanded ? content : content.slice(0, Math.min(limit, content.length))}
      {!expanded && content.length > limit &&
        <li className="text-secondary">
            <button className="hover:underline underline-offset-4 decoration-1" onClick={() => setExpanded(true)}>
                Show more ...
            </button>
        </li>
      }
    </ul>
  )
}