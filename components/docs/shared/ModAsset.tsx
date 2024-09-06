import assets from "@/lib/docs/assets";
import ItemDisplay from "@/components/docs/shared/ItemDisplay";
import {getParams} from "@nimpl/getters/get-params";
import sources from "@/lib/docs/sources";
import type {ImgHTMLAttributes} from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { location: string };

export default async function ModAsset({ location, ...props }: Props) {
  const params = getParams() || {};
  const source = params.slug ? await sources.getProjectSource(params.slug as string) : undefined; 
  const resultAsset = await assets.getAssetResource(location, source);

  return (
    <div>
      {resultAsset ? <ItemDisplay asset={resultAsset} {...props} /> : <span className="bg-accent p-0.5">{location}</span>}
    </div>
  );
}