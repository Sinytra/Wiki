import type { AudioHTMLAttributes } from 'react';
import { ProjectContext } from '@repo/shared/types/service';
import service from '@/lib/service';

type Props = Omit<AudioHTMLAttributes<HTMLAudioElement>, 'src'> & {
  ctx: ProjectContext | null;
  src: string;
};

export async function BindableAudio(ctx: ProjectContext | null, props: Omit<Props, 'ctx'>) {
  return Audio({ ...props, ctx });
}

export default async function Audio({ src, ctx, ...props }: Props) {
  const asset = await service.getAsset(src, ctx);
  if (!asset) {
    return null;
  }

  return <audio {...props} src={asset.src} />;
}
