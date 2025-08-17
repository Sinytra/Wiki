import type {ImgHTMLAttributes} from "react";
import AssetBase from "@/components/docs/shared/asset/AssetBase";
import AssetDisplay from "@/components/docs/shared/asset/AssetDisplay";
import {ProjectContext} from "@repo/shared/types/service";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { ctx: ProjectContext | null; location: string };

export async function BindableAsset(ctx: ProjectContext | null, props: Omit<Props, 'ctx'>) {
  return Asset({...props, ctx});
}

export default async function Asset({location, ...props}: Props) {
  const noCtx = {...props, ctx: undefined};
  return (
    <AssetBase
      display={
        ({asset}) => <AssetDisplay asset={asset} {...noCtx} />
      }
      location={location}
      {...props}
    />
  )
}