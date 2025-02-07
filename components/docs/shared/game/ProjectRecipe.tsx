import remoteService from "@/lib/service/remoteService";
import {getParams} from "@nimpl/getters/get-params";
import service from "@/lib/service";
import RotatingItemDisplaySlot from "@/components/docs/shared/game/RotatingItemDisplaySlot";
import {GameProjectRecipe, RecipeIngredient, RecipeItem, ResolvedItem} from "@/lib/service/types";
import resourceLocation from "@/lib/util/resourceLocation";
import RecipeIngredientDisplay from "@/components/docs/shared/game/RecipeIngredientDisplay";

interface Slot {
  x: number;
  y: number;
}

type SlotMap = Record<number, Slot>;

interface GameRecipeType {
  name: string; // TODO Localize
  background: string;
  inputSlots: SlotMap;
  outputSlots: SlotMap;
}

type LocaleFile = Record<string, string>;
async function getLanguageDefs(): Promise<LocaleFile> {
  const locale = 'en_us'; // TODO
  const resp = await fetch(process.env.BUILTIN_LOCALE_SOURCES + locale + '.json', {
    next: {
      tags: ['locale'],
      revalidate: 9999999
    }
  });
  return resp.json();
}

const craftingShapedType: GameRecipeType = {
  name: 'Shaped Crafting',
  background: 'gui/recipe/crafting_shaped',
  inputSlots: {
    1: {x: 16, y: 16},
    2: {x: 52, y: 16},
    3: {x: 88, y: 16},
    4: {x: 16, y: 52},
    5: {x: 52, y: 52},
    6: {x: 88, y: 52},
    7: {x: 16, y: 88},
    8: {x: 52, y: 88},
    9: {x: 88, y: 88},
  },
  outputSlots: {
    1: {x: 204, y: 52},
  }
}

const types: { [key: string]: GameRecipeType } = {
  'minecraft:crafting_shaped': craftingShapedType
}

async function resolveAsset(locale: LocaleFile, slug: string, src: RecipeItem): Promise<ResolvedItem | null> {
  const loc = resourceLocation.parse(src.id);
  const asset = await service.getAsset(slug, src.id, null);
  const name = loc ? locale[`item.${loc.namespace}.${loc.path}`] || src.id : src.id;
  return !asset ? null : {
    id: src.id,
    src: asset,
    name
  } as ResolvedItem
}

async function resolveAssets(locale: LocaleFile, slug: string, src: RecipeItem[]): Promise<ResolvedItem[]> {
  const res = await Promise.all(src.map(async s => {
    // TODO s.sources
    return resolveAsset(locale, slug, s);
  }));
  return res.filter(s => s !== null);
}

async function RecipeBody({slug, recipe, type}: {slug: string; recipe: GameProjectRecipe, type: GameRecipeType}) {
  const background = await service.getAsset(slug, type.background, null);
  const locale = await getLanguageDefs();

  return (
    <div className="relative shrink-0">
      <img src={background?.src} alt={background?.id} className="sharpRendering min-w-fit"/>

      {...recipe.inputs.map(async (input, i) => {
        const slot = type.inputSlots[input.slot];
        if (!slot) {
          return null;
        }
        const assets = 'tag' in input ? input.tag.items : input.items;
        const resolved = await resolveAssets(locale, slug, assets);
        if (resolved.length < 1) {
          console.error('failed to resolve', input);
          return null;
        }
        return (
          <RotatingItemDisplaySlot src={resolved} key={i} className="absolute" style={{left: `${slot.x}px`, top: `${slot.y}px`}}/>
        );
      })}

      {...recipe.outputs.map(async (output, i) => {
        const slot = type.outputSlots[output.slot];
        if (!slot) {
          return null;
        }
        const asset = output.items[0];
        const resolved = await resolveAsset(locale, slug, asset);
        return resolved ? (
          <RotatingItemDisplaySlot src={[resolved]} key={i} className="absolute" style={{left: `${slot.x}px`, top: `${slot.y}px`}}/>
        ) : null;
      })}
    </div>
  )
}

function countOccurrences(ingredients: RecipeIngredient[]): Record<string, number> {
  let counts: {[key: string]: number} = {};
  ingredients.forEach(ing => {
    if ('tag' in ing) {
      const item = ing.tag.items[0]; // TODO
      counts[item.id] = (counts[item.id] || 0) + ing.count;
    } else {
      const item = ing.items[0];
      counts[item.id] = (counts[item.id] || 0) + item.count;
    }
  })
  return counts;
}

export default async function ProjectRecipe({id}: { id: string }) {
  const params = getParams() || {};
  const slug = params.slug as any;

  const recipe = await remoteService.getProjectRecipe(slug, id);
  if (!recipe) {
    return null;
  }
  const type = types[recipe.type];
  const locale = await getLanguageDefs();
  const inputCounts = countOccurrences(recipe.inputs);
  const outputCounts = countOccurrences(recipe.outputs);

  return (
    <table>
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
          {type.name}
        </td>
        <td className="align-top">
          <ul>
            {Object.entries(inputCounts).sort((a, b) => b[1] - a[1]).map(async ([id, count], index) => {
              const resolved = await resolveAsset(locale, slug, {id, sources: []});
              if (!resolved) {
                return null; // TODO
              }

              return (
                <li key={index}>
                  <RecipeIngredientDisplay count={count} item={resolved} />
                </li>
              )
            })}
          </ul>
        </td>
        <td className="align-top">
          <ul>
            {Object.entries(outputCounts).sort((a, b) => b[1] - a[1]).map(async ([id, count], index) => {
              const resolved = await resolveAsset(locale, slug, {id, sources: []});
              if (!resolved) {
                return null; // TODO
              }

              return (
                <li key={index}>
                  <RecipeIngredientDisplay count={count} item={resolved} />
                </li>
              )
            })}
          </ul>
        </td>
        <td>
          <div className="my-2">
            <RecipeBody slug={slug} recipe={recipe} type={type} />
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  );
}
