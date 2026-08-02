import { marked } from 'marked';

const CHINESE_CHARACTERS_PER_MINUTE = 300;
const ENGLISH_WORDS_PER_MINUTE = 200;
const CODE_TOKENS_PER_MINUTE = 120;
const MINUTES_PER_IMAGE = 0.2;

export interface ContentMetrics {
  chineseCharacters: number;
  englishWords: number;
  codeTokens: number;
  imageCount: number;
}

type ContentToken = {
  type: string;
  text?: string;
  tokens?: ContentToken[];
  items?: ContentToken[];
  header?: { tokens: ContentToken[] }[];
  rows?: { tokens: ContentToken[] }[][];
};

function countLanguageUnits(text: string) {
  return {
    chineseCharacters: (text.match(/\p{Script=Han}/gu) ?? []).length,
    englishWords: (text.match(/[\p{Script=Latin}\p{N}]+/gu) ?? []).length,
  };
}

function htmlToText(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:#\d+|#x[\da-f]+|[a-z]+);/gi, ' ');
}

/**
 * 从 Markdown token 中分别统计正文、代码与图片。
 */
export function analyzeContent(content: string): ContentMetrics {
  const metrics: ContentMetrics = {
    chineseCharacters: 0,
    englishWords: 0,
    codeTokens: 0,
    imageCount: 0,
  };

  const visitTokens = (tokens: ContentToken[]) => {
    for (const token of tokens) {
      if (token.type === 'code' || token.type === 'codespan') {
        const units = countLanguageUnits(token.text ?? '');
        metrics.codeTokens += units.chineseCharacters + units.englishWords;
        continue;
      }

      if (token.type === 'image') {
        metrics.imageCount += 1;
        // 图片的 tokens 是替代文本，不应重复计入正文。
        continue;
      }

      let text = '';
      if (token.type === 'text' && !token.tokens) {
        text = token.text ?? '';
      } else if (token.type === 'html') {
        text = htmlToText(token.text ?? '');
      }

      if (text) {
        const units = countLanguageUnits(text);
        metrics.chineseCharacters += units.chineseCharacters;
        metrics.englishWords += units.englishWords;
      }

      if (token.type === 'table') {
        visitTokens(token.header?.flatMap(cell => cell.tokens) ?? []);
        visitTokens(
          token.rows?.flatMap(row => row.flatMap(cell => cell.tokens)) ?? []
        );
      } else if (token.type === 'list') {
        visitTokens(token.items ?? []);
      } else if (token.tokens) {
        visitTokens(token.tokens);
      }
    }
  };

  visitTokens(marked.lexer(content) as ContentToken[]);

  return metrics;
}

/**
 * 计算文章可读内容的总单位数，代码 token 也计入文章字数。
 */
export function countWords(content: string): number {
  const metrics = analyzeContent(content);
  return (
    metrics.chineseCharacters + metrics.englishWords + metrics.codeTokens
  );
}

/**
 * 根据文章长度计算连续的长文修正系数。
 * 1200 个内容单位以内不修正，之后使用温和的凸函数加速增长。
 */
export function readingLengthFactor(wordCount: number): number {
  const threshold = 1200;
  const growthScale = 4800;
  const growthRate = 0.05;
  const growthExponent = 1.1;
  const extraWords = Math.max(0, wordCount - threshold);

  return (
    1 +
    growthRate * Math.pow(extraWords / growthScale, growthExponent)
  );
}

/**
 * 计算预计阅读时间（分钟）。
 */
export function readingTime(content: string): number {
  const metrics = analyzeContent(content);
  const wordCount =
    metrics.chineseCharacters + metrics.englishWords + metrics.codeTokens;
  const baseMinutes =
    metrics.chineseCharacters / CHINESE_CHARACTERS_PER_MINUTE +
    metrics.englishWords / ENGLISH_WORDS_PER_MINUTE +
    metrics.codeTokens / CODE_TOKENS_PER_MINUTE +
    metrics.imageCount * MINUTES_PER_IMAGE;
  const minutes = Math.ceil(baseMinutes * readingLengthFactor(wordCount));

  return Math.max(1, minutes);
}
