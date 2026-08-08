import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { serializePostMarkdown } from '../../utils/agent-content';
import { getPostPath, getPostUrl } from '../../utils/route';
import { site } from '../../config';

type Props = {
  post: CollectionEntry<'blog'>;
};

export const getStaticPaths = (async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return posts.map((post) => ({
    params: { slug: getPostPath(post) },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET = (({ props }) => {
  const { post } = props as Props;
  const canonicalUrl = new URL(getPostUrl(post), site.url).toString();

  return new Response(serializePostMarkdown(post), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      Link: `<${canonicalUrl}>; rel="canonical"`,
    },
  });
}) satisfies APIRoute;
