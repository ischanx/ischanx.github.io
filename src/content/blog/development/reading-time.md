---
title: 如何实现阅读时间计算功能
description: 从文章卡片显示的分钟数出发，推演如何为 Markdown 技术博客实现可解释、可校准的阅读时间计算。
image: https://cdn.chanx.tech/image/covers/technical-blog-reading-time-estimation.webp
createDate: 2026-08-02T00:00:00.000Z
updateDate: 2026-08-02T00:00:00.000Z
tags:
  - engineering
draft: false
sticky: false
---

博客里的预计阅读时间，需要在构建时从文章 Markdown 中计算出整数分钟数，并展示在文章卡片上。实现不涉及实时行为，但需要让每篇文章都使用同一套、能解释的计算规则。

阅读时间不是对读者的精确预测，而是内容体量信号。读者看到“5 分钟”时，应该能大致判断是否适合现在阅读。本文从线性基线开始，依次处理 Markdown 解析、代码和图片的权重，以及长文的额外成本。

## 从线性模型开始

阅读时间的基础模型很简单。设一篇文章有一定数量的可读单位，按固定速度换算成分钟；如果图片也需要停下来阅读，再给每张图片补一点时间：

```ts
const estimatedMinutes = Math.ceil(
  readableUnits / unitsPerMinute + imageCount * minutesPerImage,
);
```

这是多数实现的起点。下面几种成熟方案都采用线性模型，区别只在 `readableUnits` 的统计方式和图片项：

| 实现 | 基础规则 | 内容处理 | 图片 | 长文修正 |
| --- | --- | --- | --- | --- |
| [`reading-time`](https://github.com/ngryman/reading-time/blob/master/src/reading-time.ts) | 默认 200 单位/分钟 | CJK 字符单独计数，其他内容按单词边界计数 | 不单独处理 | 无 |
| [`remark-reading-time`](https://github.com/mattjennings/remark-reading-time/blob/main/index.js) | 复用 `reading-time` | 从 Markdown AST 收集 `text`、`code` 节点 | 不收集图片 | 无 |
| [Forem / DEV](https://github.com/forem/forem/blob/main/app/services/markdown_processor/parser.rb) | 275 词/分钟 | 将 Markdown 源内容按非词字符切分 | 不单独处理 | 无 |
| [Ghost](https://github.com/TryGhost/Ghost/blob/main/ghost/core/test/unit/frontend/helpers/reading-time.test.js) | 275 词/分钟 | 按文章正文计算 | 封面和内嵌图片各加 12 秒 | 无 |

它们的共同点是线性：内容翻倍，时间也翻倍；`Math.ceil` 只负责把展示结果变成整数分钟。

因此，第一版功能完全可以只统计字数并套用固定速度。问题在于，技术博客的输入不是纯文本。中文没有稳定的空格分词，代码块的阅读成本也不同于正文，直接把 Markdown 字符串交给一个通用词数函数，会让后续调参失去依据。要继续完善模型，先要把输入拆开。

## 从 Markdown 中提取可读内容

不要先用正则删除 HTML 再数词。下面的写法会把 HTML 标签和代码里的尖括号当成同一种东西：

```ts
const text = content.replace(/<[^>]*>/g, '');
```

`a < b`、`Array<string>` 和 `<span>文本</span>` 都可能出现在一篇 Markdown 文章里。正则不知道哪段是代码，哪段才应该清理。这里应当交给 Markdown 解析器判断内容类型，再在解析结果上统计。

使用 `marked` 解析 Markdown 后，可以遍历 token，把正文、代码和图片分别放进指标对象：

```ts
const tokens = marked.lexer(content);

marked.walkTokens(tokens, token => {
  if (token.type === 'code' || token.type === 'codespan') {
    const units = countLanguageUnits(token.text);
    metrics.codeTokens += units.chineseCharacters + units.englishWords;
    return;
  }

  if (token.type === 'image') {
    metrics.imageCount += 1;
    return;
  }

  if (token.type === 'text' && !token.tokens) {
    const units = countLanguageUnits(token.text);
    metrics.chineseCharacters += units.chineseCharacters;
    metrics.englishWords += units.englishWords;
  }
});
```

这样，后续计算不再面对一个模糊的“字数”，而是面对中文字符、英文单词、代码计数单位和图片数量。这里的 `codeTokens` 是简化的字段名：它按中文字符和连续的拉丁字母或数字片段计数，并不是对代码运行语言级 lexer。解析器没有替我们决定每种内容值多少分钟，但它把这个决策从字符串清理逻辑中分离出来。以后要忽略链接地址、调整图片处理，或为公式增加权重，都有明确的位置可以修改。

## 为不同内容建立基础时间

有了分类指标，就可以把线性模型展开成更贴近技术文章的基础时间。本文示例参数是中文每分钟 300 字、英文每分钟 200 词、代码每分钟 120 个代码计数单位、每张图片增加 0.2 分钟：

```ts
const baseMinutes =
  chineseCharacters / chineseCharactersPerMinute +
  englishWords / englishWordsPerMinute +
  codeTokens / codeTokensPerMinute +
  imageCount * minutesPerImage;
```

图片的 0.2 分钟就是 12 秒，与 Ghost 的处理方式一致。代码速度设得更低，并不表示读者一定逐行阅读代码，而是承认关键代码片段通常需要识别变量、控制流和调用关系。中文和英文分开计算，则避免把英文单词误当作中文字符。

这些参数不是标准答案，而是一组可以校准的默认值。文章以整段源码为主时，代码速度应该提高；图片只是装饰时，`minutesPerImage` 可以设为 0。把参数集中在计算函数中，正是为了让这种调整不影响 token 解析和卡片展示。

## 给长文增加规则，并用测试固定它

基础时间已经足够支持这个功能。长文修正是额外选择：文章足够长时，读者可能需要回看前文、在章节之间切换，因此可以让单位时间缓慢增加。下面的示例只在 1200 个内容单位之后启用一条连续函数：

```ts
function readingLengthFactor(readableUnits: number): number {
  const extraUnits = Math.max(0, readableUnits - 1200);
  return 1 + 0.05 * Math.pow(extraUnits / 4800, 1.1);
}

const estimatedMinutes = Math.ceil(
  baseMinutes * readingLengthFactor(readableUnits),
);
```

这一步并不是主流线性模型的必需部分，而是为了避免极长技术文章被过于乐观地估算。对纯中文正文，6000、15000、30000 字分别得到 21、58、136 分钟；随着篇幅增加，有效阅读速度会温和下降，但没有采用会迅速失控的平方函数。若页面只把阅读时间当作粗略筛选信号，直接返回 `Math.ceil(baseMinutes)` 也完全成立。

最后用测试把规则锁住。当前测试覆盖中英文混排、代码里的尖括号、HTML token、代码和图片权重，以及 6000、15000、30000 字的结果区间。测试不会证明任何人一定在 136 分钟读完 30000 字，但能确保下一次改参数时，阅读时间的变化是有意的。至此，计算流程就是：Markdown 解析为内容指标，指标换算为基础时间，按需应用长文规则，最后向上取整并显示在卡片上。

阅读时间的公式不应被当成固定常量。以教程、源码讲解为主的文章，可以降低代码阅读速度；以图表、流程图为主的文章，可以提高图片时间；当某类内容长期表现出稳定差异时，再为它补充独立的计数指标或系数。先调整已有参数，确有明确的内容边界后再扩展模型，能让这个功能随着文章类型演进，同时保持计算规则简单、可解释。
