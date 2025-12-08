import {ItemProperties, ProjectContext} from "@repo/shared/types/service";
import Asset from "@/components/docs/shared/asset/Asset";
import {useTranslations} from "next-intl";
import {getContentLink, getVanillaWikiLink} from "@/lib/project/game/content";
import PageLink from "@/components/docs/PageLink";
import {NavLink} from "@/components/navigation/link/NavLink";

interface Props {
  ctx: ProjectContext;
  properties: ItemProperties;
}

type PropertyType =
  'literal'
  | 'code_literal'
  | 'i18n_literal'
  | 'weighted_flag'
  | 'bool'
  | 'item'
  | 'damage'
  | 'hunger';

interface ItemProperty {
  type: PropertyType;
  link?: string;
}

const SUPPORTED_PROPERTIES: { [key: string]: ItemProperty | PropertyType } = {
  // Wiki
  id: 'code_literal',
  type: 'i18n_literal',
  // Blocks
  stack_size: 'weighted_flag',
  required_tool: 'item',
  blast_resistance: {type: 'literal', link: getVanillaWikiLink('Explosion#Blast_resistance')},
  hardness: {type: 'literal', link: getVanillaWikiLink('Breaking#Blocks_by_hardness')},
  flammable: {type: 'bool', link: getVanillaWikiLink('Fire#Flammable_blocks')},
  // Items
  /// Generic
  rarity: {type: 'i18n_literal', link: getVanillaWikiLink('Rarity')},
  /// Tools
  durability: {type: 'literal', link: getVanillaWikiLink('Durability')},
  mining_speed: {type: 'literal', link: getVanillaWikiLink('Breaking#Mining_efficiency')},
  attack_damage: {type: 'damage', link: getVanillaWikiLink('Damage#Dealing_damage')},
  attack_speed: {type: 'literal', link: getVanillaWikiLink('Melee_attack#Attack_cooldown')},
  enchantability: {type: 'literal', link: getVanillaWikiLink('Enchanting_mechanics#Enchantability')},
  /// Food
  nutrition: {type: 'hunger', link: getVanillaWikiLink('Food')}
};

function RenderedProperty({name, type, value, ctx}: {
  name: string;
  type: PropertyType;
  value: any;
  ctx: ProjectContext
}) {
  const t = useTranslations('ContentProperties');

  if (type === 'weighted_flag' && !Number.isNaN(value)) {
    return value > 0 ? t('weighted_flag.true', {count: value}) : t('weighted_flag.false');
  }

  if (type === 'bool') {
    return value ? t('bool.true') : t('bool.false');
  }

  if (type === 'item') {
    const link = getContentLink(ctx, value);
    return (
      <NavLink href={link}>
        <Asset location={value} ctx={ctx}/>
      </NavLink>
    )
  }

  if (type === 'damage' && Number.isInteger(value) && value >= 0) {
    const visual = Array(Math.floor(value / 2)).fill(0).map((_, i) => (
      <Asset key={i} ctx={ctx} location="icon/heart" alt={"\u2764\uFE0F"}
             className="inline-block" width={9} height={9}/>
    ));
    if (value % 2 == 1) {
      visual.push((
        <Asset key="half" ctx={ctx} location="icon/half_heart" alt={"\u{1F494}"}
               className="inline-block" width={9} height={9}/>));
    }
    return visual.length < 1 ? value : (
      <span>
        {value} (<span>{visual}</span>)
      </span>
    )
  }

  if (type === 'hunger' && Number.isInteger(value) && value >= 0) {
    const visual = Array(Math.floor(value / 2)).fill(0).map((_, i) => (
      <Asset key={i} ctx={ctx} location="icon/hunger" alt={"\u{1F357}"}
             className="inline-block" width={9} height={9}/>
    ));
    if (value % 2 == 1) {
      visual.push((
        <Asset alt={"\u{1F356}"} key="half" ctx={ctx} className="inline-block" location="icon/half_hunger" width={9}
               height={9}/>));
    }
    return visual.length < 1 ? value : (
      <span>
        {value} (<span>{visual}</span>)
      </span>
    )
  }

  if (type === 'i18n_literal') {
    const key = `${name}.${value}`;
    // @ts-expect-error dynamic key
    return t.has(key) ? t(key) : t(`${name}.unknown`);
  }

  if (type === 'code_literal') {
    return (
      <span className="font-mono text-xsm break-all">
        {value}
      </span>
    );
  }

  // Format numbers
  if (!Number.isNaN(value)) {
    const decimals = Math.abs((value * 100) % 1);
    return decimals > 0 ? (value as number).toFixed(2) : value;
  }

  return value;
}

export default function ContentProperties({properties, ctx}: Props) {
  const t = useTranslations('ContentProperties');
  const order = Object.keys(SUPPORTED_PROPERTIES);

  return (
    <div className="w-full">
      <table className="mb-0! table w-full table-fixed">
        <tbody>
        {Object.entries(properties)
          .filter(([_, value]) => value != null)
          .sort(([a, _], [b, __]) => order.indexOf(a) - order.indexOf(b))
          .map(([key, value]) => {
            const type = SUPPORTED_PROPERTIES[key] || 'literal';
            const propType = typeof type === 'string' ? type : type.type;
            const link = typeof type === 'string' ? null : type.link;
            const Wrapper = ({children}: { children: any }) => link ?
              <PageLink href={link}>{children}</PageLink> : children;

            return (
              <tr key={key}>
                <td className="border-r-0 border-b-0 border-l-0 text-sm font-medium break-all">
                  <Wrapper>
                    {/*@ts-expect-error has message*/}
                    {t.has(`properties.${key}`) ? t(`properties.${key}`) : key}
                  </Wrapper>
                </td>
                <td className={`table-padding-sm border-r-0 border-b-0 border-l-0 text-sm`}>
                  <RenderedProperty
                    name={key}
                    value={value}
                    ctx={ctx}
                    type={propType}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}