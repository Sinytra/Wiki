import assets from "@/lib/docs/assets";
import ItemDisplay from "@/components/docs/shared/ItemDisplay";
import Image from "next/image";
import CraftingBackground from '@/components/assets/crafting_background.png';

interface Props {
  slots: (string | null)[]
  result: string;
}

// TODO Counts
export default function CraftingRecipe({slots, result}: Props) {
  const displaySlots = slots.slice(0, Math.min(slots.length, 9));
  const assetSlots = displaySlots.map(slot => slot === null ? null : assets.getAssetURL(slot));
  const resultAsset = assets.getAssetURL(result);

  return (
    <div className="relative">
      <Image unoptimized priority src={CraftingBackground} alt="background" width={260} height={136} />

      <div className="absolute top-4 left-4 grid grid-cols-3 gap-1">
        {assetSlots.map((asset, index) => (
          asset !== null ? <ItemDisplay key={index} asset={asset}/> : <div key={index}></div>
        ))}
      </div>

      { resultAsset && <div className="absolute top-[52px] left-[204px] w-[32px] h-[32px]"><ItemDisplay asset={resultAsset}/></div> }
    </div>
  )
}