import type {ImgHTMLAttributes} from "react";
import AssetBase from "@/components/docs/shared/asset/AssetBase";
import AssetDisplay from "@/components/docs/shared/asset/AssetDisplay";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { project?: string; location: string };

export default async function Asset({location, ...props}: Props) {
  return (
    <AssetBase
      display={
        ({asset}) => <AssetDisplay asset={asset} {...props} />
      }
      location={location}
      {...props}
    />
  )
}