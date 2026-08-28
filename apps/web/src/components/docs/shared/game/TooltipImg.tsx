'use client';

import React, { useEffect, useRef, useState } from 'react';

const OFFSET_X = 15;
const OFFSET_Y = -33;

interface CursorPosition {
  x: number;
  y: number;
}

interface Properties {
  id: string;
  tag?: string | null;
  children?: any;
}

export default function TooltipImg(props: Properties) {
  const anchor = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<CursorPosition | null>(null);
  const visible = cursor !== null;

  useEffect(() => {
    if (!visible) return;

    const onMouseMove = (event: MouseEvent) => {
      if (!anchor.current?.contains(event.target as Node)) {
        setCursor(null);
        return;
      }
      setCursor({ x: event.clientX, y: event.clientY });
    };
    const onPointerGone = () => setCursor(null);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onPointerGone);
    window.addEventListener('blur', onPointerGone);
    window.addEventListener('scroll', onPointerGone, true);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onPointerGone);
      window.removeEventListener('blur', onPointerGone);
      window.removeEventListener('scroll', onPointerGone, true);
    };
  }, [visible]);

  return (
    <div
      ref={anchor}
      onMouseEnter={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setCursor(null)}
    >
      {cursor && (
        <div className="minetip-tooltip" style={{ top: cursor.y + OFFSET_Y, left: cursor.x + OFFSET_X }}>
          <span className="font-minecraft">
            {props.id}
            {props.tag && <p className="m-0! mt-1! text-xs text-secondary text-shadow-none">#{props.tag}</p>}
          </span>
        </div>
      )}
      {props.children}
    </div>
  );
}
