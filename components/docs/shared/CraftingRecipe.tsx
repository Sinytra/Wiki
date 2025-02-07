import ItemDisplay from "@/components/docs/shared/util/ItemDisplay";
import Image from "next/image";
import CraftingBackground from '@/components/assets/crafting_background.png';
import {getParams} from "@nimpl/getters/get-params";
import service from "@/lib/service";

interface Props {
  slots: (string | null)[]
  result: string;
  count?: number;
}

export default async function CraftingRecipe({slots, result, count}: Props) {
  const params = getParams() || {};
  const slug = params.slug as any;
  const version = (params.version || null) as any;

  const displaySlots = slots.slice(0, Math.min(slots.length, 9));
  const assetSlots = await Promise.all(displaySlots.map(async slot => slot === null ? null : service.getAsset(slug, slot, version)));
  const resultAsset = await service.getAsset(slug, result, version);

  return (
    <div className="relative">
      <Image className="sharpRendering" unoptimized priority src={CraftingBackground} alt="background" width={260} height={136}/>

      <div className="absolute top-4 left-4 grid grid-cols-3 gap-1">
        {assetSlots.map((asset, index) => (
          asset !== null ? <ItemDisplay key={index} asset={asset}/> : <div key={index}></div>
        ))}
      </div>

      {resultAsset &&
          <div className="absolute flex justify-center items-center top-[42px] left-[194px] w-[52px] h-[52px]">
              <div className="relative flex justify-center items-center -m-0.5 p-0.5 w-[36px] h-[36px]">
                <div>
                    <ItemDisplay asset={resultAsset}/>
                </div>
                {count && count > 1 &&
                    <span className="absolute bottom-0 right-0 text-white text-base leading-1 text-left sharpRendering z-10" style={{fontFamily: 'Minecraft, sans-serif', textShadow: '2px 2px 0 #3F3F3F'}}>
                      {count}
                    </span>
                }
              </div>
          </div>}
    </div>
  )
}