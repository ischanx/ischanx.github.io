import { categoryMap, tagMap } from '../config';

/**
 * 导航相关工具函数
 */

export function getCategorySlugFromPost(post: { id: string }): string {
  return post.id.split('/').filter(Boolean)[0] ?? '';
}

export function getCategoryLabel(slug: string): string {
  return categoryMap[slug] ?? slug;
}

export function getTagSlug(slug: string): string | null {
  const normalized = slug.trim();
  return tagMap[normalized] ? normalized : null;
}

export function getTagLabel(slug: string): string {
  return tagMap[slug] ?? slug;
}

export function normalizeTags(tags?: string[]): string[] {
  return [
    ...new Set(
      (tags ?? [])
        .filter(tag => tag.trim().length > 0)
        .map(tag => tag.trim())
    ),
  ];
}

/**
 * 生成标签详情页URL
 * @param slug 标签 slug
 * @returns 标签详情页URL
 */
export function createTagUrl(slug: string): string {
  if (!slug.trim()) return '/tags';

  return getTagSlug(slug) ? `/tags/${slug}` : '/tags';
}

/**
 * 生成分类详情页URL
 * @param categorySlug 分类 slug
 * @returns 分类详情页URL
 */
export function createCategoryUrl(categorySlug: string): string {
  return categorySlug.trim() ? `/categories/${categorySlug}` : '/categories';
}
