import type { CollectionEntry } from 'astro:content';
import { categoryMap, site } from '../config';
import {
  getCategoryLabel,
  getCategorySlugFromPost,
  getTagLabel,
} from './navigation';
import { getPostUrl } from './route';

const toAbsoluteUrl = (path: string) => new URL(path, site.url).toString();

const toSingleLine = (value: string) => value.replace(/\s+/g, ' ').trim();

const escapeMarkdownLabel = (value: string) =>
  toSingleLine(value).replace(/([\\[\]])/g, '\\$1');

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

export const getPostMarkdownUrl = (post: CollectionEntry<'blog'>) =>
  `${toAbsoluteUrl(getPostUrl(post))}.md`;

export function serializePostMarkdown(post: CollectionEntry<'blog'>): string {
  const { data } = post;
  const canonicalUrl = toAbsoluteUrl(getPostUrl(post));
  const category = data.category ?? getCategoryLabel(getCategorySlugFromPost(post));
  const tags = (data.tags ?? []).map(getTagLabel);
  const metadata = [
    `- 发布于：${formatDate(data.createDate)}`,
    data.updateDate ? `- 更新于：${formatDate(data.updateDate)}` : null,
    `- 分类：${category}`,
    tags.length > 0 ? `- 标签：${tags.join('、')}` : null,
    `- 原文：${canonicalUrl}`,
  ].filter(Boolean);
  const body = (post.body ?? '').trim();

  return [
    `# ${data.title}`,
    '',
    `> ${toSingleLine(data.description)}`,
    '',
    ...metadata,
    '',
    body,
    '',
  ].join('\n');
}

export function serializeLlmsTxt(posts: CollectionEntry<'blog'>[]): string {
  const sortedPosts = [...posts].sort(
    (a, b) => b.data.createDate.getTime() - a.data.createDate.getTime()
  );
  const recentPosts = sortedPosts.slice(0, 10);

  const mainLinks = [
    `- [首页](${toAbsoluteUrl('/')}): 个人博客首页与最近更新。`,
    `- [文章归档](${toAbsoluteUrl('/archives')}): 按时间浏览全部文章。`,
    `- [项目](${toAbsoluteUrl('/projects')}): 尚在制作和探索中的个人玩具。`,
    `- [关于](${toAbsoluteUrl('/about')}): 关于作者、经历与联系方式。`,
    `- [RSS](${toAbsoluteUrl('/rss.xml')}): 全站订阅源。`,
    `- [Sitemap](${toAbsoluteUrl('/sitemap.xml')}): 可抓取页面索引。`,
  ];
  const categoryLinks = Object.entries(categoryMap).map(
    ([slug, label]) =>
      `- [${label}](${toAbsoluteUrl(`/categories/${slug}`)}): 浏览该分类下的文章。`
  );
  const recentArticleLinks = recentPosts.map(
    (post) =>
      `- [${escapeMarkdownLabel(post.data.title)}](${getPostMarkdownUrl(post)}): ${toSingleLine(post.data.description)}`
  );

  return [
    `# ${site.title}`,
    '',
    '> 陈同学的个人博客，记录软件开发、AI 与 Agent 实践、学习和生活。',
    '',
    '本站为每篇公开文章提供独立的 Markdown 版本。这里仅保留导航与最近更新，完整页面索引请使用 Sitemap；文章原文地址可在对应 Markdown 的元信息中找到。',
    '',
    '## 主要入口',
    '',
    ...mainLinks,
    '',
    '## 内容分类',
    '',
    ...categoryLinks,
    '',
    '## 最近更新',
    '',
    ...recentArticleLinks,
    '',
  ].join('\n');
}
