import service from "@/lib/service";
import RotatingItemDisplaySlot from "@/components/docs/shared/game/RotatingItemDisplaySlot";
import {GameProjectRecipe, GameRecipeType, ResolvedItem} from "@/lib/service/types";
import RecipeIngredientDisplay from "@/components/docs/shared/game/RecipeIngredientDisplay";
import recipes, {ResolvedRecipe, ResolvedSlotItem} from "@/lib/game/recipes";
import {cn} from "@/lib/utils";
import {ContentRouteParams} from "@/lib/game/content";

interface Properties {
  project: string;
  recipe: GameProjectRecipe;
  embedded?: boolean;
  params: ContentRouteParams;
}

async function RecipeBody({slug, recipe, type, params}: { slug: string; recipe: ResolvedRecipe, type: GameRecipeType; params: ContentRouteParams }) {
  const background = await service.getAsset(slug, type.background, null);

  return (
    <div className="relative shrink-0">
      <img src={background?.src} alt={background?.id} className="sharpRendering shrink-0 min-w-fit"/>

      {...recipe.inputs.map(async (input, i) => (
        <RotatingItemDisplaySlot src={input.items} key={i} className="absolute shrink-0 flex" params={params}
                                 style={{left: `${input.slot.x}px`, top: `${input.slot.y}px`}}/>
      ))}

      {...recipe.outputs.map(async (output, i) => (
        <RotatingItemDisplaySlot src={output.items} key={i} className="absolute shrink-0 flex" count={output.count}
                                 params={params} style={{left: `${output.slot.x}px`, top: `${output.slot.y}px`}}/>
      ))}
    </div>
  )
}

type IngredientCount = { count: number; item: ResolvedItem };

function countOccurrences(ingredients: ResolvedSlotItem[]): IngredientCount[] {
  let counts: { [key: string]: number } = {};
  ingredients.forEach(ing => {
    const item = ing.items[0];
    counts[item.id] = (counts[item.id] || 0) + ing.count;
  });
  return Object.entries(counts)
    .map(([k, v]) => {
      const item = ingredients
        .map(i => i.items[0])
        .filter(i => i != undefined)
        .find(i => i.id == k);
      return item ? {count: v, item: item} : undefined;
    })
    .filter(i => i != undefined);
}

// TODO Handle missing items
export default async function ResolvedProjectRecipe({project, recipe, embedded, params}: Properties) {
  const processed = await recipes.processRecipe(recipe);
  const resolvedRecipe = await recipes.resolveRecipe(processed);

  const inputCounts = countOccurrences(resolvedRecipe.inputs);
  const outputCounts = countOccurrences(resolvedRecipe.outputs);

  return (
    <table className={cn('[&_td]:bg-primary-alt/50', embedded && 'mb-0')}>
      <thead>
      <tr>
        <th>Recipe Type</th>
        <th>Ingredients</th>
        <th>Outputs</th>
        <th>Recipe preview</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td className="align-middle whitespace-nowrap">
          {processed.type.localizedName}
        </td>
        <td className="align-top">
          <ul className="w-max pl-4">
            {inputCounts
              .sort((a, b) => b.count - a.count)
              .map(async ({count, item}, index) => (
                <li key={index}>
                  <RecipeIngredientDisplay count={count} item={item} params={params}/>
                </li>
              ))}
          </ul>
        </td>
        <td className="align-top">
          <ul className="w-max max-w-60 pl-4">
            {outputCounts
              .sort((a, b) => b.count - a.count)
              .map(async ({count, item}, index) => (
                <li key={index}>
                  <RecipeIngredientDisplay count={count} item={item} params={params}/>
                </li>
              ))}
          </ul>
        </td>
        <td>
          <div className="my-2 w-max">
            <RecipeBody slug={project} recipe={resolvedRecipe} type={processed.type} params={params}/>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  );
}
