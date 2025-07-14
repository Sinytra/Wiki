import type {MDXComponents} from 'mdx/types';
import Callout from "@/components/docs/shared/Callout";
import ModAsset from "@/components/docs/shared/asset/ModAsset";
import * as LucideReact from "lucide-react";
import {DE, FR, TW} from "country-flag-icons/react/3x2";
import Asset from "@/components/docs/shared/asset/Asset";
import MetaDocsTitle from "@/components/meta-docs/MetaDocsTitle";
import ComponentWidget from "@/components/meta-docs/ComponentWidget";
import CountryFlag from '@repo/ui/util/CountryFlag';
import CodeHikeCode from "@repo/ui/blocks/markdown/CodeHikeCode";
import CodeTabs from '@repo/ui/blocks/markdown/CodeTabs';

// Used in meta-docs only
export function useMDXComponents(components: MDXComponents): MDXComponents {
  const icons = Object.keys(LucideReact)
    .filter(key => key.endsWith('Icon'))
    .reduce((obj, key) => {
      // @ts-expect-error assigning icons to object
      obj[key] = LucideReact[key];
      return obj;
    }, {});

  return {
    h1: ({ children }) => (
      <MetaDocsTitle>{children}</MetaDocsTitle>
    ),
    CodeHikeCode,
    Callout,
    CodeTabs,
    Asset,
    ModAsset, // Deprecated
    ComponentWidget,
    ...components,
    ...icons,
    FlagDE: () => (<div className="inline-block"><CountryFlag flag={DE} /></div>),
    FlagFR: () => (<div className="inline-block"><CountryFlag flag={FR}/></div>),
    FlagTW: () => (<div className="inline-block"><CountryFlag flag={TW}/></div>)
  }
}
