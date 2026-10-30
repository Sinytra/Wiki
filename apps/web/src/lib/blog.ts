import fs from 'fs/promises';
import path from 'path';
import { cache } from 'react';
import * as runtime from 'react/jsx-runtime';
import { evaluate } from '@mdx-js/mdx';
import type { MDXContent } from 'mdx/types';
import { VFile } from 'vfile';
import { matter } from 'vfile-matter';
import { compareDesc } from 'date-fns';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { type CodeHikeConfig, recmaCodeHike, remarkCodeHike } from 'codehike/mdx';
import remarkAlert from '@repo/markdown/remark-alert';
import remarkHint from '@repo/markdown/remark-hint';

const BLOGS_DIR = path.join(process.cwd(), '../../blogs');

const chConfig: CodeHikeConfig = {
  components: { code: 'CodeHikeCode' }
};

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

async function readPostFile(slug: string): Promise<VFile> {
  const vfile = new VFile({ path: path.join(BLOGS_DIR, `${slug}.mdx`) });
  vfile.value = await fs.readFile(vfile.path, 'utf8');
  matter(vfile, { strip: true });
  return vfile;
}

function readPostMetadata(slug: string, vfile: VFile): BlogPost {
  const { title, date, excerpt } = (vfile.data.matter ?? {}) as Record<string, unknown>;
  if (typeof title !== 'string' || typeof excerpt !== 'string' || date == null) {
    throw new Error(`Blog ${slug} is missing required frontmatter properties`);
  }

  return {
    slug,
    title,
    date: new Date(date as string | Date).toISOString(),
    excerpt
  };
}

const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  const slugs = (await fs.readdir(BLOGS_DIR)).filter((f) => f.endsWith('.mdx')).map((f) => f.slice(0, -4));
  const posts = await Promise.all(slugs.map(async (slug) => readPostMetadata(slug, await readPostFile(slug))));

  return posts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
});

const getPost = cache(async (slug: string): Promise<{ post: BlogPost; Content: MDXContent } | null> => {
  if (!(await getAllPosts()).some((post) => post.slug === slug)) {
    return null;
  }

  const vfile = await readPostFile(slug);
  const { default: Content } = await evaluate(vfile, {
    ...runtime,
    remarkPlugins: [[remarkCodeHike, chConfig], remarkGfm, remarkAlert, remarkHint],
    rehypePlugins: [rehypeSlug],
    recmaPlugins: [[recmaCodeHike, chConfig]]
  });

  return { post: readPostMetadata(slug, vfile), Content };
});

export default {
  getAllPosts,
  getPost
};
