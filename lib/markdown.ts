import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize, {defaultSchema} from 'rehype-sanitize';
import rehypeRaw from "rehype-raw";
import {Schema} from "hast-util-sanitize";

// Try to provide the same features as MR
// https://support.modrinth.com/en/articles/8801962-advanced-markdown-formatting

// https://github.com/leizongmin/js-xss/blob/master/dist/xss.js#L12
const schema: Schema = {
  ...defaultSchema,
  attributes: {
    a: ['target', 'href', 'title'],
    abbr: ['title'],
    address: [],
    area: ['shape', 'coords', 'href', 'alt'],
    article: [],
    aside: [],
    audio: [
      'autoplay',
      'controls',
      'crossorigin',
      'loop',
      'muted',
      'preload',
      'src',
    ],
    b: [],
    bdi: ['dir'],
    bdo: ['dir'],
    big: [],
    blockquote: ['cite'],
    br: [],
    caption: [],
    center: [],
    cite: [],
    code: [],
    col: ['align', 'valign', 'span', 'width'],
    colgroup: ['align', 'valign', 'span', 'width'],
    dd: [],
    del: ['datetime'],
    details: ['open'],
    div: [],
    dl: [],
    dt: [],
    em: [],
    figcaption: [],
    figure: [],
    font: ['color', 'size', 'face'],
    footer: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    header: [],
    hr: [],
    i: [],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    ins: ['datetime'],
    kbd: [],
    li: [],
    mark: [],
    nav: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    section: [],
    small: [],
    span: [],
    sub: [],
    summary: [],
    sup: [],
    strong: [],
    strike: [],
    table: ['width', 'border', 'align', 'valign'],
    tbody: ['align', 'valign'],
    td: ['width', 'rowspan', 'colspan', 'align', 'valign'],
    tfoot: ['align', 'valign'],
    th: ['width', 'rowspan', 'colspan', 'align', 'valign'],
    thead: ['align', 'valign'],
    tr: ['rowspan', 'align', 'valign'],
    tt: [],
    u: [],
    ul: [],
    video: [
      'autoplay',
      'controls',
      'crossorigin',
      'loop',
      'muted',
      'playsinline',
      'poster',
      'preload',
      'src',
      'height',
      'width',
    ],
  },
  tagNames: [
    'a',
    'abbr',
    'address',
    'area',
    'article',
    'aside',
    'audio',
    'b',
    'bdi',
    'bdo',
    'big',
    'blockquote',
    'br',
    'caption',
    'center',
    'cite',
    'code',
    'col',
    'colgroup',
    'dd',
    'del',
    'details',
    'div',
    'dl',
    'dt',
    'em',
    'figcaption',
    'figure',
    'font',
    'footer',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'hr',
    'i',
    'img',
    'ins',
    'kbd',
    'li',
    'mark',
    'nav',
    'ol',
    'p',
    'pre',
    's',
    'section',
    'small',
    'span',
    'sub',
    'summary',
    'sup',
    'strong',
    'strike',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr',
    'tt',
    'u',
    'ul',
    'video'
  ]
};

async function renderMarkdown(content: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    // .use(remarkFrontmatter)
    // .use(remarkGfm)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeRaw)
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .process(content);

  return String(file);
}

const markdown = {
  renderMarkdown
};

export default markdown;