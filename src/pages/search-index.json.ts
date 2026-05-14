import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { createSearchIndex } from '../utils/search';

export const prerender = true;

export const GET: APIRoute = async () => {
  // 获取所有非草稿文章
  const posts = await getCollection('blog', ({ data }) => {
    return !data.draft;
  });

  // 创建搜索索引
  const searchIndex = createSearchIndex(posts);

  // 返回JSON格式的搜索索引
  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
} 