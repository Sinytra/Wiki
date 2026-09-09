import { ImageResponse } from 'next/og';
import type { ReactNode } from 'react';
import { SITE_NAME, OG_IMAGE_SIZE } from '@/lib/seo';

export interface OpenGraphFont {
  name: string;
  data: ArrayBuffer;
  style: 'normal';
}

export interface OpenGraphImageData {
  project?: { text: string; icon?: string | null } | null;
  title: string;
  description?: string | null;
  icon?: string | null;
}

const COLORS = {
  background: '#1B1B1F',
  border: '#3A3A42',
  textPrimary: '#fffff5DB',
  textSecondary: '#EBEBF599'
};

function ProjectWidget({ text, icon }: { text: string; icon?: string | null }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: COLORS.textSecondary, fontSize: 40 }}>
      {icon && <img src={icon} width={64} height={64} alt="" style={{ borderRadius: 3 }} />}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 700 }}>{text}</span>
    </div>
  );
}

function Frame({ children, project }: { children: ReactNode; project?: OpenGraphImageData['project'] | null }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '48px 64px',
        background: `${COLORS.background}`,
        color: COLORS.textPrimary,
        fontFamily: 'Inter'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16
        }}
      >
        {project && <ProjectWidget {...project} />}

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, color: COLORS.textSecondary, fontSize: 28 }}>
          <span>{SITE_NAME}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 48, marginTop: 24, marginBottom: 24 }}>
        {children}
      </div>
    </div>
  );
}

export function renderOpenGraphImage(data: OpenGraphImageData, fonts: OpenGraphFont[]): ImageResponse {
  const { project, title, description, icon } = data;
  const titleSize = title.length > 28 ? 60 : 72;

  return new ImageResponse(
    <Frame project={project}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          gap: 48
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: titleSize,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineClamp: 2
          }}
        >
          {title}
        </span>

        {description && (
          <span
            style={{
              display: 'block',
              fontSize: 30,
              lineHeight: 1.35,
              color: COLORS.textSecondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineClamp: 3
            }}
          >
            {description}
          </span>
        )}
      </div>

      {icon && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 260,
            height: 260,
            flexShrink: 0
          }}
        >
          <img src={icon} width={200} height={200} alt="" style={{ objectFit: 'contain' }} />
        </div>
      )}
    </Frame>,
    {
      ...OG_IMAGE_SIZE,
      fonts
    }
  );
}
