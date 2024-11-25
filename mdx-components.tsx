import type {MDXComponents} from 'mdx/types';
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import Callout from "@/components/docs/shared/Callout";
import ModAsset from "@/components/docs/shared/ModAsset";
import {SquirrelIcon} from "lucide-react";
import {DE, FR, TW} from "country-flag-icons/react/3x2";
import CountryFlag from "@/components/util/CountryFlag";
import Asset from "@/components/docs/shared/Asset";

// Used in meta-docs only
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({children}) => (
      <DocsContentTitle>{children}</DocsContentTitle>
    ),
    Callout,
    Asset,
    ModAsset, // Deprecated
    ...components,
    SquirrelIcon,
    FlagDE: () => (<div className="inline-block"><CountryFlag flag={DE} /></div>),
    FlagFR: () => (<div className="inline-block"><CountryFlag flag={FR}/></div>),
    FlagTW: () => (<div className="inline-block"><CountryFlag flag={TW}/></div>)
  }
}