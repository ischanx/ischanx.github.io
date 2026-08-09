import type { ReactNode } from 'react';
import {
  defaultRemarkPlugins,
  Streamdown,
  type PluginConfig,
} from 'streamdown';
import 'streamdown/styles.css';
import 'katex/dist/katex.min.css';
import remarkDirective from 'remark-directive';
import remarkColorBlocks from '../../utils/remark-color-blocks.mjs';
import remarkHeadingIds from '../../utils/remark-heading-ids.mjs';

export interface StreamdownArticleProps {
  markdown: string;
}

interface StreamdownRendererProps extends StreamdownArticleProps {
  plugins: PluginConfig;
}

const translations = {
  close: '关闭',
  copied: '已复制',
  copyCode: '复制代码',
  copyLink: '复制链接',
  copyTable: '复制表格',
  copyTableAsCsv: '复制为 CSV',
  copyTableAsMarkdown: '复制为 Markdown',
  copyTableAsTsv: '复制为 TSV',
  downloadDiagram: '下载图表',
  downloadDiagramAsMmd: '下载 MMD',
  downloadDiagramAsPng: '下载 PNG',
  downloadDiagramAsSvg: '下载 SVG',
  downloadFile: '下载文件',
  downloadImage: '下载图片',
  downloadTable: '下载表格',
  downloadTableAsCsv: '下载 CSV',
  downloadTableAsMarkdown: '下载 Markdown',
  exitFullscreen: '退出全屏',
  externalLinkWarning: '即将打开外部链接',
  imageNotAvailable: '图片暂时无法显示',
  mermaidFormatMmd: 'MMD 源文件',
  mermaidFormatPng: 'PNG 图片',
  mermaidFormatSvg: 'SVG 图片',
  openExternalLink: '打开外部链接',
  openLink: '打开链接',
  tableFormatCsv: 'CSV',
  tableFormatMarkdown: 'Markdown',
  tableFormatTsv: 'TSV',
  viewFullscreen: '全屏查看',
};

export default function StreamdownArticle({
  markdown: markdownContent,
  plugins,
}: StreamdownRendererProps) {
  return (
    <Streamdown
      mode="static"
      plugins={plugins}
      remarkPlugins={[
        ...Object.values(defaultRemarkPlugins),
        remarkDirective,
        remarkColorBlocks,
        remarkHeadingIds,
      ]}
      allowedTags={{ 'color-block': ['color'] }}
      components={{
        'color-block': ({ children, color }) => (
          <div
            className={`color-block color-block--${String(color ?? 'gray')}`}
            data-color-block={String(color ?? 'gray')}
          >
            {children as ReactNode}
          </div>
        ),
      }}
      shikiTheme={['github-light', 'github-dark']}
      controls={{
        code: { copy: true, download: true },
        mermaid: {
          copy: true,
          download: true,
          fullscreen: true,
          panZoom: true,
        },
        table: { copy: true, download: true, fullscreen: true },
      }}
      translations={translations}
      lineNumbers
      linkSafety={{ enabled: false }}
    >
      {markdownContent}
    </Streamdown>
  );
}
