/**
 * 计算文本内容的字数（中英文混合）
 */
export function countWords(content: string): number {
  // 移除HTML标签
  const text = content.replace(/<[^>]*>/g, '');

  // 中文字符数（每个中文字符算一个字）
  const cnWords = (text.match(/[\u4e00-\u9fa5]/g) || []).length;

  // 英文单词数
  const enWords = (text.match(/[a-zA-Z0-9]+/g) || []).length;

  return cnWords + enWords;
}

/**
 * 计算阅读时间（以分钟为单位）
 * 假设中文阅读速度为每分钟300字，英文阅读速度为每分钟200词
 */
export function readingTime(content: string): number {
  const wordCount = countWords(content);
  // 平均阅读速度约为每分钟300字
  const minutes = Math.ceil(wordCount / 300);
  return minutes === 0 ? 1 : minutes; // 至少返回1分钟
} 