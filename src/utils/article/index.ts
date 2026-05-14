import '@vitejs/plugin-react/preamble';
import { decorateCodeBlocks, initArticleScrollAreas } from './code-blocks';
import { enhanceHeadingAnchors } from './heading-anchors';
import { renderMermaidDiagrams } from './mermaid';

export const initializeArticleContent = async (container: Element) => {
  decorateCodeBlocks(container);
  initArticleScrollAreas();

  try {
    renderMermaidDiagrams(container);
  } catch (error) {
    console.error('Mermaid 图表初始化失败:', error);
  }

  enhanceHeadingAnchors(container);
  initArticleScrollAreas();
};
