// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rss from "@astrojs/rss";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
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
    build: {
      // Shiki ships a few large language modules, but they are only requested
      // when an article contains that language. Streamdown/Mermaid are selected
      // per article below their page boundary, so these are not initial chunks.
      chunkSizeWarningLimit: 800,
    },
  },
  server: {
    port: 3080,
  },
  i18n: {
    defaultLocale: site.language,
    locales: [site.language, "en"],
  },
  integrations: [
    mdx(),
    react(),
    sitemap({
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
  prefetch: {
    defaultStrategy: "hover",
  },
});
