import type {ImgHTMLAttributes} from "react";
import AssetBase from "@/components/docs/shared/asset/AssetBase";
import ItemAssetDisplay from "@/components/docs/shared/asset/ItemAssetDisplay";
import {ProjectContext} from "@repo/shared/types/service";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { ctx: ProjectContext | null; location: string };

export default async function ItemAsset({location, ...props}: Props) {
  return (
    <AssetBase
      display={
        ({asset}) => <ItemAssetDisplay asset={asset} {...props} />
      }
      location={location}
      {...props}
    />
  )
}