import type { CollectionEntry } from 'astro:content';

type PostRoute =
  | CollectionEntry<'blog'>
  | { id: string };

/**
 * 获取文章的实际链接路径
 * 内容 ID 的首段是分类 slug，不属于文章 URL。
 * 其余目录与文件名共同组成 blogSlug。
 * 
 * @param post 文章对象或包含 id 的对象
 * @returns 处理后的链接路径（不含前导斜杠）
 */
export function getPostPath(post: PostRoute): string {
  const segments = post.id.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  if (segments.length > 1) return segments.slice(1).join('/');

  return segments[0] ?? '';
}

/**
 * 获取文章的完整URL路径
 * 包含/blog/前缀
 * 
 * @param post 文章对象或包含 id 的对象
 * @returns 完整的URL路径（不含结尾斜杠）
 */
export function getPostUrl(post: PostRoute): string {
  const path = getPostPath(post);
  // 确保路径不以斜杠结尾
  return `/blog/${path.replace(/\/+$/, '')}`.replace(/\/+$/, '');
} 
