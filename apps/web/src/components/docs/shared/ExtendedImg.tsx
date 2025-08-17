import {ComponentPropsWithoutRef} from "react";
import {ProjectContext} from "@repo/shared/types/service";
import Asset from "@/components/docs/shared/asset/Asset";

type ImgProps = ComponentPropsWithoutRef<'img'> & { ctx: ProjectContext };

export default function ExtendedImg(ctx: ProjectContext, props: Omit<ImgProps, 'ctx'>) {
  return BoundExtendedImg({...props, ctx});
}

function BoundExtendedImg(props: ImgProps) {
  if (props.src && typeof props.src === 'string' && props.src.startsWith('@')) {
    const location = props.src.substring(1);
    delete props.src;
    return (
      <Asset {...props} ctx={props.ctx} location={location} />
    )
  }

  return <img {...props}/>;
}