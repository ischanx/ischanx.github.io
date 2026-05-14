import type { CollectionEntry } from 'astro:content';

// 博客文章类型
export type BlogPost = CollectionEntry<'blog'>;

/**
 * 对文章进行排序，首先置顶的文章，然后按日期排序
 * @param posts 文章列表
 * @returns 排序后的文章列表
 */
export function sortPosts(posts: BlogPost[]): BlogPost[] {
  // 分离置顶文章和普通文章
  const stickyPosts = posts.filter(post => post.data.sticky);
  const normalPosts = posts.filter(post => !post.data.sticky);

  // 分别按发布日期排序
  const sortedStickyPosts = stickyPosts.sort(
    (a, b) => b.data.createDate.valueOf() - a.data.createDate.valueOf()
  );

  const sortedNormalPosts = normalPosts.sort(
    (a, b) => b.data.createDate.valueOf() - a.data.createDate.valueOf()
  );

  // 合并置顶文章和普通文章
  return [...sortedStickyPosts, ...sortedNormalPosts];
}

/**
 * 生成分页页码链接
 * @param current 当前页码
 * @param total 总页数
 * @returns 分页链接数组
 */
export function generatePageLinks(
  current: number,
  total: number
): { page: number; url: string; isCurrent: boolean }[] {
  const delta = 2; // 当前页前后显示的页码数
  const range: { page: number; url: string; isCurrent: boolean }[] = [];

  // 计算需要显示的页码范围
  let leftBound = Math.max(1, current - delta);
  let rightBound = Math.min(total, current + delta);

  // 调整范围确保始终显示相同数量的页码
  if (rightBound - leftBound < 2 * delta) {
    if (leftBound === 1) {
      rightBound = Math.min(total, leftBound + 2 * delta);
    } else if (rightBound === total) {
      leftBound = Math.max(1, rightBound - 2 * delta);
    }
  }

  // 生成页码链接
  for (let i = leftBound; i <= rightBound; i++) {
    range.push({
      page: i,
      url: i === 1 ? '/' : `/page/${i}`,
      isCurrent: i === current
    });
  }

  return range;
}

/**
 * 对文章进行分页处理
 * @param posts 排序后的文章列表
 * @param page 当前页码
 * @param perPage 每页显示的文章数量
 * @returns 分页相关的信息
 */
export function paginatePosts(posts: BlogPost[], page: number, perPage: number) {
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / perPage);

  // 计算当前页的起始索引和结束索引
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  // 获取当前页的文章
  const currentPagePosts = posts.slice(startIndex, endIndex);

  // 计算上一页和下一页的链接
  const prevPage = page > 1
    ? page === 2
      ? '/'
      : `/page/${page - 1}`
    : null;

  const nextPage = page < totalPages
    ? `/page/${page + 1}`
    : null;

  // 生成分页链接
  const pageLinks = generatePageLinks(page, totalPages);

  // 分页范围计算
  const startPost = (page - 1) * perPage + 1;
  const endPost = Math.min(startPost + perPage - 1, totalPosts);

  return {
    posts: currentPagePosts,
    totalPosts,
    totalPages,
    currentPage: page,
    prevPage,
    nextPage,
    pageLinks,
    startPost,
    endPost
  };
} 