import {generateStaticParamsFor, importPage} from 'nextra/pages';
import {useMDXComponents as getMDXComponents} from '../../mdx-components';
import {defaultLocale, Locale, locales} from '@/lang';
import {Metadata} from 'next';

interface Props {
  params: Promise<Params>
}

interface Params {
  mdxPath?: string[];
}

export async function generateStaticParams() {
  const params = await generateStaticParamsFor('mdxPath')();
  return params
    .map(p => {
      if (p.lang != defaultLocale && Array.isArray(p.mdxPath)) {
        p.mdxPath.unshift(p.lang as any);
      }
      return p;
    });
}

async function resolvePage(params: Params) {
  let lang, path;
  if (params.mdxPath && params.mdxPath.length > 0 && locales.includes(params.mdxPath[0] as Locale)) {
    lang = params.mdxPath[0];
    path = params.mdxPath.slice(1);
  } else {
    lang = defaultLocale;
    path = params.mdxPath;
  }

  return importPage(path, lang);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const {metadata} = await resolvePage(params);
  return metadata;
}

const Wrapper = getMDXComponents({}).wrapper;

export default async function Page(props: Props) {
  const params = await props.params;
  const result = await resolvePage(params);
  const {default: MDXContent, toc, metadata} = result;
  return (
    <div className={params.mdxPath ? 'doc-wrapper' : ''}>
      <Wrapper toc={toc} metadata={metadata}>
        <MDXContent {...props} params={params}/>
      </Wrapper>
    </div>
  );
}