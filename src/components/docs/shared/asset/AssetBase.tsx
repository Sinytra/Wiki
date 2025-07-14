import {getParams} from "@nimpl/getters/get-params";
import type {ImgHTMLAttributes} from "react";
import service from "@/lib/service";
import {AssetLocation} from "@repo/shared/assets";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { project?: string; location: string, display: (props: {asset: AssetLocation}) => any };

export default async function AssetBase({ location, project, display: Display, ...props }: Props) {
  const params = getParams() || {};
  const slug = params.slug as any;
  const version = (params.version || null) as any;
  const locale = (params.locale || null) as any;
  const ctx = {id: project || slug, version, locale};
  const resultAsset = await service.getAsset(location, ctx);

  return resultAsset
    ? <Display asset={resultAsset} {...props} />
    : <span className="bg-secondary p-0.5">{location}</span>
}