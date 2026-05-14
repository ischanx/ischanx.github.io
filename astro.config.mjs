// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rss from "@astrojs/rss";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkColorBlocks from "./src/utils/remark-color-blocks.mjs";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { site } from "./src/config";
import fs from "fs";
import path from "path";

/**
 * 生成robots.txt文件
 * @param {string} outputDir 输出目录路径
 */
function generateRobotsTxt(outputDir) {
  const contents = `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
Sitemap: ${site.url}/sitemap-index.xml`;

  const outputPath = path.join(outputDir, "robots.txt");
  fs.writeFileSync(outputPath, contents);
  console.log(`✅ robots.txt 已生成至 ${outputPath}`);
}

// https://astro.build/config
export default defineConfig({
  site: site.url,
  trailingSlash: "never",
  build: {
    format: "file",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    port: 3000,
  },
  i18n: {
    defaultLocale: site.language,
    locales: [site.language, "en"],
  },
  integrations: [
    mdx(),
    react(),
    sitemap({
      filter: (page) =>
        !page.includes("/tags/") && !page.includes("/categories/"),
      changefreq: "weekly",
      lastmod: new Date(),
      serialize(item) {
        // 为每项添加额外的属性
        return {
          ...item,
          priority:
            item.url === "" ? 1.0 : item.url.includes("/blog/") ? 0.8 : 0.7,
        };
      },
    }),
    // 添加构建后钩子，自动生成SEO文件
    {
      name: "seo-files-generator",
      hooks: {
        "astro:build:done": async ({ dir }) => {
          try {
            // 直接调用内联函数生成robots.txt
            generateRobotsTxt(dir.pathname);
          } catch (error) {
            console.error("生成SEO文件时出错:", error);
          }
        },
      },
    },
  ],
  markdown: {
    syntaxHighlight: false, // 禁用默认的语法高亮，使用 rehype-pretty-code 替代
    remarkPlugins: [remarkGfm, remarkDirective, remarkColorBlocks],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append" }],
      [
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark",
            light: "github-light",
          },
          keepBackground: true,
          grid: true,
        },
      ],
    ],
  },
  prefetch: {
    defaultStrategy: "hover",
  },
});
