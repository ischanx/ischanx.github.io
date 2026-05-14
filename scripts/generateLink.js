import { glob } from 'glob';
import fs from 'fs/promises';
import matter from 'gray-matter';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// 读取环境变量
dotenv.config();

// 检查必要的环境变量
const requiredEnvVars = ['OPENAI_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`错误: ${envVar} 环境变量未设置`);
    console.error('请在 .env 文件中设置以下变量：');
    console.error(requiredEnvVars.map(v => `${v}=你的值`).join('\n'));
    process.exit(1);
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
  model: process.env.OPENAI_MODEL,
});

async function generatePermalinks(titles) {
  const prompt = `请根据以下中文标题生成对应的英文 URL 友好的且简短且 SEO 友好的链接（使用连字符分隔的小写字母，不要包含特殊字符）。
  不要直接翻译标题，可以取标题的关键词，生成的链接尽量在三个单词以内。
请返回一个 JSON 数组，每个元素包含 originalTitle 和 permalink 两个字段。

标题列表：
${titles.join('\n')}

请按照以下格式返回：
[
  {
    "originalTitle": "原标题1",
    "permalink": "url-friendly-link-1"
  },
  {
    "originalTitle": "原标题2",
    "permalink": "url-friendly-link-2"
  }
]`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
    });

    let response = completion.choices[0].message.content.trim();
    const permalinkMap = new Map();

    try {
      // 处理可能的代码块格式
      response = response.replace(/```json\n?|\n?```/g, '').trim();
      const results = JSON.parse(response);
      results.forEach(item => {
        if (item.originalTitle && item.permalink) {
          permalinkMap.set(item.originalTitle, item.permalink);
        }
      });
    } catch (parseError) {
      console.error('解析 AI 返回的 JSON 时出错:', parseError);
      console.error('原始返回:', response);
      return null;
    }

    return permalinkMap;
  } catch (error) {
    console.error('生成链接时出错:', error);
    return null;
  }
}

async function processFiles() {
  try {
    // 获取所有 md 和 mdx 文件
    const files = await glob('src/content/blog/**/*.{md,mdx}');
    const filesWithoutPermalink = [];
    const fileContentMap = new Map();

    // 首先收集所有需要处理的文件
    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      const { data, content: markdownContent } = matter(content);

      if (!data.permalink) {
        filesWithoutPermalink.push({
          file,
          title: data.title,
        });
        fileContentMap.set(file, {
          data,
          markdownContent,
        });
      }
    }

    if (filesWithoutPermalink.length === 0) {
      console.log('没有找到需要添加 permalink 的文件');
      return;
    }

    console.log(`找到 ${filesWithoutPermalink.length} 个需要处理的文件`);

    // 批量生成 permalink
    const titles = filesWithoutPermalink.map(f => f.title);
    const permalinkMap = await generatePermalinks(titles);

    if (!permalinkMap) {
      console.error('生成链接失败');
      return;
    }

    // 更新文件
    for (const { file, title } of filesWithoutPermalink) {
      const permalink = permalinkMap.get(title);
      console.log(title, permalink);
      if (permalink) {
        const { data, markdownContent } = fileContentMap.get(file);
        const updatedContent = matter.stringify(markdownContent, {
          ...data,
          permalink,
        });

        await fs.writeFile(file, updatedContent);
        console.log(`已更新文件 ${file} 的 permalink: ${permalink}`);
      }
    }
  } catch (error) {
    console.error('处理文件时出错:', error);
  }
}

// 运行脚本
processFiles();
