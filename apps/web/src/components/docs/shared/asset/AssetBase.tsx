import type { ImgHTMLAttributes } from 'react';
import service from '@/lib/service';
import { AssetLocation } from '@repo/shared/assets';
import { ProjectContext } from '@repo/shared/types/service';

interface AssetProps {
  ctx: ProjectContext | null;
  location: string;
  item?: boolean;
  display: (props: { asset: AssetLocation }) => any;
}

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & AssetProps;

export default async function AssetBase({ location, ctx, item, display: Display, ...props }: Props) {
  const resultAsset = item ? await service.getItemAsset(location, ctx) : await service.getAsset(location, ctx);

  return resultAsset ? (
    <Display asset={resultAsset} {...props} />
  ) : (
    <span className="bg-secondary p-0.5">{location}</span>
  );
}
