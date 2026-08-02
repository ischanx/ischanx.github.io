import assert from 'node:assert/strict';
import test from 'node:test';
import {
  analyzeContent,
  countWords,
  readingLengthFactor,
  readingTime,
} from './content.ts';

test('分别统计中英文内容', () => {
  assert.deepEqual(analyzeContent('中文测试 hello world'), {
    chineseCharacters: 4,
    englishWords: 2,
    codeTokens: 0,
    imageCount: 0,
  });
});

test('代码中的尖括号不会吞掉后续正文', () => {
  const content = [
    '继续阅读',
    '',
    '```ts',
    'if (a < b && c > d) run();',
    '```',
  ].join('\n');

  assert.deepEqual(analyzeContent(content), {
    chineseCharacters: 4,
    englishWords: 0,
    codeTokens: 6,
    imageCount: 0,
  });
  assert.equal(countWords(content), 10);
});

test('只移除 Marked 已识别的 HTML 标签', () => {
  assert.deepEqual(analyzeContent('<div>中文 text</div>'), {
    chineseCharacters: 2,
    englishWords: 1,
    codeTokens: 0,
    imageCount: 0,
  });
});

test('中英文使用各自的基础阅读速度', () => {
  assert.equal(readingTime('字'.repeat(300)), 1);
  assert.equal(readingTime('word '.repeat(200)), 1);
});

test('代码和图片计入额外阅读时间', () => {
  const code = ['```ts', ...Array(240).fill('value'), '```'].join('\n');
  const images = Array(10).fill('![示意图](image.webp)').join('\n\n');

  assert.equal(readingTime(code), 2);
  assert.equal(readingTime(images), 2);
});

test('图片替代文本不会重复计入正文', () => {
  const images = Array(5)
    .fill('![一段很长的图片替代文本](image.webp)')
    .join('\n\n');

  assert.deepEqual(analyzeContent(images), {
    chineseCharacters: 0,
    englishWords: 0,
    codeTokens: 0,
    imageCount: 5,
  });
});

test('长文系数连续且增长逐渐加快', () => {
  assert.equal(readingLengthFactor(1200), 1);
  assert.ok(readingLengthFactor(1200.001) - 1 < 0.000001);

  const firstIncrease =
    readingLengthFactor(3000) - readingLengthFactor(2000);
  const secondIncrease =
    readingLengthFactor(4000) - readingLengthFactor(3000);
  assert.ok(secondIncrease > firstIncrease);
  assert.ok(readingLengthFactor(30000) < 2);
});

test('超长文章的最终阅读时间按凸函数增长', () => {
  const cases = [
    { words: 6000, expectedMinutes: 21 },
    { words: 15000, expectedMinutes: 58 },
    { words: 30000, expectedMinutes: 136 },
  ];

  for (const { words, expectedMinutes } of cases) {
    assert.equal(readingTime('字'.repeat(words)), expectedMinutes);
  }
});
