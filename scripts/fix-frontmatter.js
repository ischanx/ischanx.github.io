import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_ROOT = path.join(__dirname, 'src/content/blog');
const DIRS = ['前端', '后端', '笔记', '随笔', '其他'];

// 处理所有Markdown文件
async function processFiles() {
  let totalFixed = 0;

  for (const dir of DIRS) {
    const blogDir = path.join(BLOG_ROOT, dir);

    if (!fs.existsSync(blogDir)) {
      console.log(`目录不存在: ${blogDir}`);
      continue;
    }

    const files = fs.readdirSync(blogDir);
    console.log(`正在处理目录: ${dir}, 文件数: ${files.length}`);

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const { data, content: markdownContent } = matter(content);

      // 日期转换函数
      const parseDate = dateStr => {
        if (!dateStr) return new Date();

        // 如果已经是日期对象，直接返回
        if (dateStr instanceof Date) return dateStr;

        // 转换为字符串
        const dateString = String(dateStr);

        // 尝试解析日期时间格式
        return new Date(dateString);
      };

      console.log(`处理文件: ${file}`);

      // 创建新的frontmatter
      const newFrontmatter = {
        title: data.title || '',
        description: data.description || file.replace('.md', ''),
        createDate: parseDate(data.date || data.createDate),
        updateDate: parseDate(data.updateDate || data.date || data.createDate),
        image: data.image || '',
        tags: Array.isArray(data.tags)
          ? data.tags
          : data.tags
          ? [data.tags]
          : [],
        category: data.categories
          ? Array.isArray(data.categories)
            ? data.categories[0]
            : data.categories
          : dir,
        draft: data.publish === false ? true : false,
        sticky: data.sticky ? true : false,
      };

      // 生成新的文件内容
      const newFileContent = matter.stringify(markdownContent, newFrontmatter);

      // 写入文件
      fs.writeFileSync(filePath, newFileContent);
      console.log(`已修复: ${dir}/${file}`);
      totalFixed++;
    }
  }

  return totalFixed;
}

processFiles()
  .then(total => {
    console.log(`所有文件修复完成！共修复 ${total} 个文件`);
  })
  .catch(err => {
    console.error('处理文件时出错:', err);
  });
