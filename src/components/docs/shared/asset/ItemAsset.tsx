import type {ImgHTMLAttributes} from "react";
import AssetBase from "@/components/docs/shared/asset/AssetBase";
import ItemAssetDisplay from "@/components/docs/shared/asset/ItemAssetDisplay";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { project?: string; location: string };

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