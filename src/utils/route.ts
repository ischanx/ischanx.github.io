import type { CollectionEntry } from 'astro:content';

/**
 * 获取文章的实际链接路径
 * 如果文章设置了永久链接(permalink)，则使用永久链接
 * 否则使用默认的内容条目 ID
 * 
 * @param post 文章对象或包含 permalink 和 id 的对象
 * @returns 处理后的链接路径（不含前导斜杠）
 */
export function getPostPath(post: CollectionEntry<'blog'> | { data: { permalink?: string }, id: string }): string {
  return post.data.permalink
    ? post.data.permalink.replace(/^\/+/, '')
    : post.id;
}

/**
 * 获取文章的完整URL路径
 * 包含/blog/前缀
 * 
 * @param post 文章对象或包含 permalink 和 id 的对象
 * @returns 完整的URL路径（不含结尾斜杠）
 */
export function getPostUrl(post: CollectionEntry<'blog'> | { data: { permalink?: string }, id: string }): string {
  const path = getPostPath(post);
  // 确保路径不以斜杠结尾
  return `/blog/${path.replace(/\/+$/, '')}`.replace(/\/+$/, '');
} 
