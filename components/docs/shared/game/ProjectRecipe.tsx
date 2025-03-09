import {getParams} from "@nimpl/getters/get-params";
import service from "@/lib/service";
import RotatingItemDisplaySlot from "@/components/docs/shared/game/RotatingItemDisplaySlot";
import {GameRecipeType, ResolvedItem} from "@/lib/service/types";
import RecipeIngredientDisplay from "@/components/docs/shared/game/RecipeIngredientDisplay";
import recipes, {ResolvedRecipe, ResolvedSlotItem} from "@/lib/game/recipes";

async function RecipeBody({slug, recipe, type}: { slug: string; recipe: ResolvedRecipe, type: GameRecipeType }) {
  const background = await service.getAsset(slug, type.background, null);
  const params = getParams();

  return (
    <div className="relative shrink-0">
      <img src={background?.src} alt={background?.id} className="sharpRendering min-w-fit"/>

      {...recipe.inputs.map(async (input, i) => (
          <RotatingItemDisplaySlot src={input.items} key={i} className="absolute" params={params}
                                   style={{left: `${input.slot.x}px`, top: `${input.slot.y}px`}}/>
      ))}

      {...recipe.outputs.map(async (output, i) => (
          <RotatingItemDisplaySlot src={output.items} key={i} className="absolute" count={output.count} params={params}
                                   style={{left: `${output.slot.x}px`, top: `${output.slot.y}px`}}/>
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
export default async function ProjectRecipe({id}: { id: string }) {
  const params = getParams() || {};
  const slug = params.slug as any;

  const recipe = await service.getProjectRecipe(slug, id);
  if (!recipe) {
    return null;
  }
  const resolvedRecipe = await recipes.resolveRecipe(recipe);

  const inputCounts = countOccurrences(resolvedRecipe.inputs);
  const outputCounts = countOccurrences(resolvedRecipe.outputs);

  return (
    <table className="[&_td]:bg-primary-alt/50">
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
          {recipe.type.localizedName}
        </td>
        <td className="align-top">
          <ul>
            {inputCounts
              .sort((a, b) => b.count - a.count)
              .map(async ({count, item}, index) => (
                <li key={index}>
                  <RecipeIngredientDisplay count={count} item={item}/>
                </li>
              ))}
          </ul>
        </td>
        <td className="align-top">
          <ul>
            {outputCounts
              .sort((a, b) => b.count - a.count)
              .map(async ({count, item}, index) => (
                <li key={index}>
                  <RecipeIngredientDisplay count={count} item={item}/>
                </li>
              ))}
          </ul>
        </td>
        <td>
          <div className="my-2">
            <RecipeBody slug={slug} recipe={resolvedRecipe} type={recipe.type}/>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  );
}
