import { getCollection } from 'astro:content';
import { site } from '../config';
import { getPostUrl } from '../utils/route';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toCanonicalUrl = (path: string) => {
  const url = new URL(path, site.url);
  url.pathname = url.pathname
    .replace(/\.html$/, '')
    .replace(/\/index$/, '/');
  return url.toString();
};

const toSitemapEntry = ({
  url,
  lastmod,
  changefreq = 'weekly',
  priority = 0.7,
}: {
  url: string;
  lastmod: Date;
  changefreq?: string;
  priority?: number;
}) => `<url><loc>${escapeXml(url)}</loc><lastmod>${lastmod.toISOString()}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority.toFixed(1)}</priority></url>`;

const getPostLastmod = (post: Awaited<ReturnType<typeof getCollection<'blog'>>>[number]) =>
  post.data.updateDate ?? post.data.createDate;

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const latestPostUpdateDate = posts.reduce<Date | null>((latest, post) => {
    const lastmod = getPostLastmod(post);
    return !latest || lastmod > latest ? lastmod : latest;
  }, null);
  const siteLastmod = latestPostUpdateDate ?? new Date();
  const postsPerPage = site.indexSettings.perPage;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const staticPages = ['/', '/about', '/archives', '/categories', '/tags', '/links'];
  const paginationPages = Array.from(
    { length: Math.max(totalPages - 1, 0) },
    (_, index) => `/page/${index + 2}`
  );

  const entries = [
    ...staticPages.map((path) => ({
      url: toCanonicalUrl(path),
      lastmod: siteLastmod,
      priority: path === '/' ? 1.0 : 0.7,
    })),
    ...paginationPages.map((path) => ({
      url: toCanonicalUrl(path),
      lastmod: siteLastmod,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: toCanonicalUrl(getPostUrl(post)),
      lastmod: getPostLastmod(post),
      priority: 0.8,
    })),
  ].sort((a, b) => b.lastmod.getTime() - a.lastmod.getTime());

  const body = `<?xml version="1.0" encoding="UTF-8"?>${[
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(toSitemapEntry),
    '</urlset>',
  ].join('')}`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
