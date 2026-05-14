import { site } from "../config";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { format } from "date-fns";
import { getPostUrl } from "../utils/route";
import { getLastModifiedDateFromGit } from "../utils/git";
import { markdownToCDATAHTML, wrapInCDATA } from "../utils/rss-utils";

export async function GET(context) {
  const posts = await getCollection("blog", (entry) => {
    return !entry.data.draft;
  });

  // 按创建日期排序，最新的在前
  posts.sort(
    (a, b) => new Date(b.data.createDate) - new Date(a.data.createDate)
  );

  // 获取作者邮箱
  const authorEmail = site.email;

  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    trailingSlash: false,
    items: posts.map((post) => {
      // 处理日期格式
      const pubDate = new Date(post.data.createDate);

      // 处理更新日期：优先使用文章中的updateDate，如果没有则尝试从Git获取
      let modifiedDate = post.data.updateDate;
      if (!modifiedDate) {
        const contentFilePath = post.filePath ?? `src/content/blog/${post.id}.md`;
        const gitUpdateDate = getLastModifiedDateFromGit(contentFilePath);
        if (gitUpdateDate && gitUpdateDate > pubDate) {
          modifiedDate = gitUpdateDate;
        }
      }

      // 构建摘要
      let description = post.data.description || "";
      if (post.data.image) {
        description = `<img src="${post.data.image}" alt="${post.data.title}" /><br />${description}`;
      }

      // 使用CDATA包装描述
      if (description.includes("<")) {
        description = wrapInCDATA(description);
      }

      // 使用getPostUrl函数获取正确的链接路径，支持permalink
      const postUrl = getPostUrl(post);
      // 移除开头的斜杠，因为link会自动拼接网站URL
      // 同时确保移除末尾的斜杠，解决guid链接末尾多斜杠的问题
      const linkPath = postUrl.replace(/^\//, "").replace(/\/$/, "");

      // 将Markdown内容转换为HTML，并用CDATA包装
      const htmlContent = markdownToCDATAHTML(post.body ?? "");

      return {
        title: post.data.title,
        description: description,
        pubDate: pubDate,
        // 如果有更新日期，添加到Atom项目中
        ...(modifiedDate && {
          modifiedDate: new Date(modifiedDate),
        }),
        link: linkPath,
        categories: [
          ...(post.data.tags || []),
          ...(post.data.category ? [post.data.category] : []),
        ],
        author: post.data.author
          ? `${post.data.author} (${authorEmail})`
          : `${site.author} (${authorEmail})`,
        content: htmlContent,
      };
    }),
    customData: `
      <language>${site.language}</language>
      <lastBuildDate>${format(
        new Date(),
        "eee, dd MMM yyyy HH:mm:ss xxxx"
      )}</lastBuildDate>
      <generator>Astro Atom Generator</generator>
      <copyright>Copyright ${new Date().getFullYear()} ${site.title}</copyright>
      <atom:link href="${
        site.url
      }/atom.xml" rel="self" type="application/atom+xml" />
      <webMaster>${authorEmail} (${site.author})</webMaster>
      <managingEditor>${authorEmail} (${site.author})</managingEditor>
    `,
    xmlns: {
      media: "http://search.yahoo.com/mrss/",
      atom: "http://www.w3.org/2005/Atom",
    },
    // 指定为Atom格式
    xmlNamespace: "http://www.w3.org/2005/Atom",
    outputFormat: "feed",
  });
}
