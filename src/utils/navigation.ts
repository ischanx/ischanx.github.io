/**
 * 导航相关工具函数
 */

/**
 * 生成标签页URL
 * @param tag 标签名
 * @returns 带有标签参数的URL
 */
export function createTagUrl(tag: string): string {
  if (!tag) return '/tags';

  // 编码标签名，以防包含特殊字符
  const encodedTag = encodeURIComponent(tag);
  return `/tags?tag=${encodedTag}`;
}

/**
 * 生成分类页URL
 * @param category 分类名
 * @returns 带有分类参数的URL
 */
export function createCategoryUrl(category: string): string {
  if (!category) return '/categories';

  // 编码分类名，以防包含特殊字符
  const encodedCategory = encodeURIComponent(category);
  return `/categories?category=${encodedCategory}`;
}

/**
 * 从URL获取标签参数
 * @returns URL中的标签参数
 */
export function getTagFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('tag');
}

/**
 * 从URL获取分类参数
 * @returns URL中的分类参数
 */
export function getCategoryFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category');
}

/**
 * 更新URL中的标签参数
 * @param tag 标签名
 */
export function updateUrlTag(tag: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set('tag', tag);
  window.history.pushState({}, '', url);
}

/**
 * 更新URL中的分类参数
 * @param category 分类名
 */
export function updateUrlCategory(category: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set('category', category);
  window.history.pushState({}, '', url);
} 