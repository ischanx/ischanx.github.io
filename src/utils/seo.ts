import fs from 'fs';
import path from 'path';
import { site } from '../config';

/**
 * 生成robots.txt文件
 * @param outputDir 输出目录
 */
export function generateRobotsTxt(outputDir: string): void {
  const robotsContent = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${site.url}/sitemap.xml`,
    `Sitemap: ${site.url}/sitemap-index.xml`,
    `Host: ${site.url}`,
    `RSS: ${site.url}/rss.xml`,
    `RSS: ${site.url}/atom.xml`,
    `RSS: ${site.url}/rss2.xml`
  ].join('\n');

  const outputPath = path.join(outputDir, 'robots.txt');
  fs.writeFileSync(outputPath, robotsContent);
  console.log(`✅ robots.txt 已生成至 ${outputPath}`);
}

/**
 * 生成额外的SEO文件
 * @param outputDir 输出目录
 */
export function generateSeoFiles(outputDir: string): void {
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 生成robots.txt
  generateRobotsTxt(outputDir);
} 