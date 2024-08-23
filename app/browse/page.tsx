import CraftingRecipe from "@/components/docs/shared/CraftingRecipe";

export default function Browse() {
  const slots: string[] = [
    'flint',
    'flint',
    'flint',
    '',
    'iron_block',
    '',
    '',
    'diamond',
    ''
  ]; 
  
  return (
    <div>
      Browse page comes here

      <CraftingRecipe slots={slots} result="furnace" />
    </div>
  )
}