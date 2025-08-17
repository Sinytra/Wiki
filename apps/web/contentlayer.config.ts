import { defineDocumentType, makeSource } from 'contentlayer2/source-files'
import remarkGfm from 'remark-gfm'
import rehypeSlug from "rehype-slug";
import { remarkCodeHike } from "codehike/mdx";

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    excerpt: { type: "string", required: true }
  },
  mdx: {
    remarkPlugins: [remarkCodeHike, remarkGfm],
    rehypePlugins: [rehypeSlug]
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/blogs/${post._raw.flattenedPath}` },
  },
}))

export default makeSource({ contentDirPath: '../../blogs', documentTypes: [Blog] })