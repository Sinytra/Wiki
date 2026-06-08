import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { type CodeHikeConfig, recmaCodeHike, remarkCodeHike } from 'codehike/mdx';

const chConfig: CodeHikeConfig = {
  components: { code: 'CodeHikeCode' }
};

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    excerpt: { type: 'string', required: true }
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/blogs/${post._raw.flattenedPath}`
    }
  }
}));

export default makeSource({
  contentDirPath: '../../blogs',
  documentTypes: [Blog],
  mdx: {
    remarkPlugins: [[remarkCodeHike, chConfig], remarkGfm],
    rehypePlugins: [rehypeSlug],
    mdxOptions: (o) => ({
      ...o,
      recmaPlugins: [[recmaCodeHike, chConfig]]
    })
  }
});
