import {ItemProperties} from "@repo/shared/types/service";
import Asset from "@/components/docs/shared/asset/Asset";
import {useTranslations} from "next-intl";

interface Props {
  properties: ItemProperties;
}

function ContentProperty({name, value}: { name: string; value: any }) {
  const t = useTranslations('ContentProperties');

  if (name === 'id') {
    return (
      <span className="font-mono text-xsm break-all">
        {value}
      </span>
    );
  }
  if (name === 'required_tool') {
    // TODO Link item
    return (
      <Asset location={value}/>
    )
  }
  if (name === 'hardness' || name === 'blast_resistance') {
    return Number.isInteger(value) ? (value as number).toFixed(1) : value;
  }
  if (typeof value === 'boolean') {
    return value ? t('bool.true') : t('bool.false');
  }
  // @ts-expect-error has message
  if (name === 'type' && t.has(`type.${value}`)) {
    // @ts-expect-error has message
    return t(`type.${value}`);
  }
  return value;
}

export default function ContentProperties({properties}: Props) {
  const t = useTranslations('ContentProperties');
  const order = ['stack_size', 'required_tool', 'blast_resistance', 'hardness', 'flammable'];

  return (
    <div className="w-full">
      <table className="mb-0! table w-full table-fixed">
        <tbody>
        {Object.entries(properties)
          .filter(([_, value]) => value != null)
          .sort(([a, _], [b, __]) => order.indexOf(a) - order.indexOf(b))
          .map(([key, value]) => (
            <tr key={key}>
              <td className="border-r-0 border-b-0 border-l-0 text-sm font-medium">
                {/*@ts-expect-error has message*/}
                {t.has(`properties.${key}`) ? t(`properties.${key}`) : key}
              </td>
              <td className={`table-padding-sm border-r-0 border-b-0 border-l-0 text-sm`}>
                <ContentProperty name={key} value={value}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}