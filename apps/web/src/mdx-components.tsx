import type {MDXComponents} from 'mdx/types';
import Callout from "@/components/docs/shared/Callout";
import ModAsset from "@/components/docs/shared/asset/ModAsset";
import {DE, FR, TW} from "country-flag-icons/react/3x2";
import {BindableAsset} from "@/components/docs/shared/asset/Asset";
import MetaDocsTitle from "@/components/about/MetaDocsTitle";
import ComponentWidget from "@/components/about/ComponentWidget";
import CountryFlag from '@repo/ui/util/CountryFlag';
import CodeHikeCode from "@repo/ui/blocks/markdown/CodeHikeCode";
import CodeTabs from '@repo/ui/blocks/markdown/CodeTabs';
import CraftingRecipe from "@/components/docs/shared/CraftingRecipe";
import {
  SquirrelIcon,
  BoxIcon,
  BracesIcon,
  PackageOpenIcon,
  PaintbrushIcon,
  UnplugIcon,
  SwatchBookIcon
} from 'lucide-react';

// Used in meta-docs only
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <MetaDocsTitle>{children}</MetaDocsTitle>
    ),
    CodeHikeCode,
    Callout,
    CodeTabs,
    Asset: BindableAsset.bind(null, null),
    ModAsset: ModAsset.bind(null, null), // Deprecated
    CraftingRecipe: CraftingRecipe.bind(null, null),
    ComponentWidget,
    ...components,
    SquirrelIcon, BoxIcon, BracesIcon, PackageOpenIcon, PaintbrushIcon, UnplugIcon, SwatchBookIcon,
    FlagDE: () => (<div className="inline-block"><CountryFlag flag={DE} /></div>),
    FlagFR: () => (<div className="inline-block"><CountryFlag flag={FR}/></div>),
    FlagTW: () => (<div className="inline-block"><CountryFlag flag={TW}/></div>)
  }
}
