import type { CollectionEntry } from 'astro:content';
import Fuse from 'fuse.js';
import type { IFuseOptions, FuseResult } from 'fuse.js';

// 为每篇文章创建搜索索引项
export interface SearchIndexItem {
  slug: string;
  title: string;
  description: string;
  body: string;
  tags: string[];
  category: string;
  createDate: Date;
  image?: string;
  permalink?: string;
}

// 从博客集合创建搜索索引数据
export function createSearchIndex(posts: CollectionEntry<'blog'>[]): SearchIndexItem[] {
  return posts.map(post => ({
    slug: post.id,
    title: post.data.title,
    description: post.data.description || '',
    body: post.body ?? '',
    tags: post.data.tags || [],
    category: post.data.category || '',
    createDate: post.data.createDate,
    image: post.data.image,
    permalink: post.data.permalink
  }));
}

// 默认的搜索选项
const defaultOptions: IFuseOptions<SearchIndexItem> = {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'description', weight: 2 },
    { name: 'tags', weight: 2 },
    { name: 'category', weight: 2 },
    { name: 'body', weight: 1 }
  ],
  includeScore: true,
  threshold: 0.4,  // 较低的阈值会产生更精确但较少的结果
  ignoreLocation: true,
  useExtendedSearch: true
};

// 创建和使用Fuse搜索实例
export function createSearchInstance(
  searchIndex: SearchIndexItem[],
  options: IFuseOptions<SearchIndexItem> = defaultOptions
): Fuse<SearchIndexItem> {
  return new Fuse(searchIndex, options);
}

// 执行搜索并返回结果
export function search(
  searchInstance: Fuse<SearchIndexItem>,
  query: string
): FuseResult<SearchIndexItem>[] {
  if (!query.trim()) return [];
  return searchInstance.search(query);
}
