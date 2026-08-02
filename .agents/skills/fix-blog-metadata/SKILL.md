---
name: fix-blog-metadata
description: 检查并修复本项目新博客文章的分类目录与 tags frontmatter，不撰写或改写文章内容。用于新增、导入、迁移 Markdown 博客后，或用户要求检查分类、标签、元数据归档时；根据全文判断唯一一级分类，将标签规范为项目允许的 slug，并完成范围受限的验证。
---

# 修复博客分类与标签

只处理 `src/content/blog/**/*.md` 的分类和标签。保留标题、摘要、正文、日期、封面、发布状态及其他元数据原样。

## 1. 确定范围

优先使用用户明确给出的文章路径。用户只说“新文章”时，合并以下结果并去重：

```bash
git diff --name-only --diff-filter=A -- 'src/content/blog/**/*.md'
git ls-files --others --exclude-standard -- 'src/content/blog/**/*.md'
```

不要因为工作区存在其他内容迁移或历史文章改动而扩大范围。没有找到新文章时，报告结果并请用户指出目标，不要批量检查所有旧文章。

## 2. 读取事实来源

每次运行都读取以下文件，不在 Skill 中复制可能过期的完整词表：

- `AGENTS.md` 的 `Content Metadata`：分类语义、tag 政策和新文章允许使用的 canonical 标签。
- `src/config.ts` 的 `categoryMap` 与 `tagMap`：中文名称对应的实际目录 slug 和 tag slug。
- `src/content.config.ts`：frontmatter schema。

以 `AGENTS.md` 的内容政策决定“能不能用于新文章”，以 `src/config.ts` 决定“文件中写哪个 slug”。`tagMap` 可能为兼容旧文章保留历史项；不把政策白名单以外的项分配给新文章，也不通过 fallback 扩张词表。

## 3. 判断分类

完整阅读每篇文章的 frontmatter 和正文，再判断文章主要目标。只选择一个一级分类：

- `development` / 软件开发：项目实现、系统设计、部署、工程化、性能优化和工程落地。
- `ai` / AI：人工智能、LLM、Agent 及相关实践是文章主线。
- `learning` / 学习：基础知识、原理、课程、阅读及非计算机学习。
- `personal` / 个人记录：经历、阶段总结、生活观察和个人叙事。

用文章主线而非技术关键词、文章形式或年份分类。AI 仅偶然作为工具出现时，不归入 AI；基础原理文章即使讨论编程，也优先归入学习。

文章所在的一级目录是分类实现来源。目录错误时移动到 `src/content/blog/<category-slug>/<filename>.md`。不要新增冗余的 `category` 或旧式 `categories` 字段；若新文章已有这些字段，移除它们，避免目录与 frontmatter 形成多个事实来源。

若目标不是新文章，而是已经跟踪或发布的旧文章，跨目录移动会改变当前文章 URL。先报告影响并取得用户确认，不要自动移动。

## 4. 修复标签

先用 `src/config.ts` 把政策允许的中文 canonical 标签映射成 tag slug，再按以下顺序选择：

1. 选技术领域维度，例如前端、后端、全栈、AI、小程序、计算机。
2. 选确实贯穿全文的知识或工程维度，例如基础知识、业务、系统设计、性能、安全、稳定性、工程化、研发体验。
3. 删除空值、重复项、技术栈名、文章形式、泛化描述、分类名重复和只在正文偶然出现的标签。
4. 通常保留 0～3 个；没有合适标签时使用空数组 `tags: []`，不要硬凑。

frontmatter 中保存 slug，而非中文显示名。例如政策中的 `前端`、`工程化` 应写成 `frontend`、`engineering`。不要仅凭标题匹配标签；必须以全文主题为依据。

以下情况必须人工权衡，不能机械叠加：

- `development` 分类不等于必须有 `engineering`。
- `learning` 分类下可用 `frontend`、`backend` 或 `computer`，基础原理明确时再加 `fundamentals`。
- `ai` 分类与 `ai` tag 可以同时存在：前者是一级方向，后者用于跨分类聚合。
- 部署文章根据重点选择 `full-stack`、`system-design`、`engineering` 等，不要全部加入。

## 5. 编辑边界

修改前检查 `git status --short`，保留用户已有改动。只允许：

- 移动目标 Markdown 到正确分类目录；
- 删除目标文章的 `category` 或 `categories` 字段；
- 修改目标文章的 `tags` 数组。

不得顺手润色标题、摘要或正文，不得修改日期、封面、draft、sticky、permalink，不得整理无关 frontmatter 格式。对语义确实无法判断的文章，列出两个候选及依据并询问用户，不要猜测。

## 6. 验证与交付

逐篇复核：目录 slug 存在于 `categoryMap`；标签都是政策允许且在 `tagMap` 中可映射的 slug；无重复；数量不超过 3；正文未变化。

运行：

```bash
git diff --check -- <目标文章路径...>
pnpm exec astro check
pnpm build
```

最后按文章列出“分类：旧值 -> 新值”和“标签：旧值 -> 新值”。若无需修改也明确说明。构建失败时区分本次元数据问题与工作区既有问题，不擅自修复无关代码。
