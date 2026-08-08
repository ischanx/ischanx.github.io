import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { serializeLlmsTxt } from '../utils/agent-content';

export const GET = (async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return new Response(serializeLlmsTxt(posts), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}) satisfies APIRoute;
