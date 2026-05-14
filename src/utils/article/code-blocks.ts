import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import CodeBlock from '../../components/article/CodeBlock';

interface ScrollAreaWindow extends Window {
  initScrollAreas?: () => void;
}

export const initArticleScrollAreas = () => {
  (window as ScrollAreaWindow).initScrollAreas?.();
};

const normalizeLanguage = (language?: string) => {
  if (!language) return 'text';

  const aliases: Record<string, string> = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    html: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
    vue: 'vue',
    yaml: 'yaml',
    yml: 'yaml',
    txt: 'text',
  };

  return aliases[language.toLowerCase()] || language.toLowerCase();
};

const getCodeLanguage = (pre: HTMLPreElement, code: HTMLElement) => {
  const language =
    pre.dataset.language ||
    code.dataset.language ||
    code.className.match(/language-([\w-]+)/)?.[1] ||
    code.className.match(/lang-([\w-]+)/)?.[1];

  return normalizeLanguage(language);
};

export const decorateCodeBlocks = (container: Element) => {
  container.querySelectorAll<HTMLPreElement>('pre').forEach(pre => {
    const code = pre.querySelector<HTMLElement>('code');
    if (!code) return;
    if (
      pre.dataset.language === 'mermaid' ||
      code.dataset.language === 'mermaid'
    )
      return;
    if (pre.closest('.code-block')) return;

    const language = getCodeLanguage(pre, code);
    const originalText = code.textContent || '';
    const highlightedPre = pre.cloneNode(true) as HTMLElement;
    const highlightedCode = highlightedPre.querySelector<HTMLElement>('code');
    const mount = document.createElement('div');
    const root = createRoot(mount);

    if (highlightedCode) {
      const lineCount = Math.max(highlightedCode.children.length, 1);
      const maxDigits = lineCount.toString().length;

      highlightedCode.setAttribute('data-line-numbers', 'true');
      highlightedCode.setAttribute(
        'data-line-numbers-max-digits',
        maxDigits.toString()
      );
    }

    pre.replaceWith(mount);
    root.render(
      createElement(CodeBlock, {
        highlightedHtml: highlightedPre.outerHTML,
        language,
        originalText,
      })
    );
  });
};
