import type {MDXComponents} from 'mdx/types';
import DocsContentTitle from "@/components/docs/layout/DocsContentTitle";
import Callout from "@/components/docs/shared/Callout";
import ModAsset from "@/components/docs/shared/ModAsset";

// Used in meta-docs only
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({children}) => (
      <DocsContentTitle>{children}</DocsContentTitle>
    ),
    Callout,
    ModAsset,
    ...components,
  }
}