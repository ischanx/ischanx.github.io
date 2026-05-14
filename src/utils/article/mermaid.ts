import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import MermaidPanel from '../../components/article/MermaidPanel';

export const renderMermaidDiagrams = (container: Element) => {
  const mermaidCodeBlocks = container.querySelectorAll<HTMLElement>(
    'pre[data-language="mermaid"] > code'
  );

  mermaidCodeBlocks.forEach(code => {
    const pre = code.parentElement;
    if (!pre || pre.dataset.mermaidRendered === 'true') return;

    const graphDefinition = code.textContent || '';
    const highlightedPre = pre.cloneNode(true) as HTMLElement;
    const mount = document.createElement('div');
    const root = createRoot(mount);

    pre.dataset.mermaidRendered = 'true';
    pre.replaceWith(mount);
    root.render(
      createElement(MermaidPanel, {
        graphDefinition,
        highlightedPre,
      })
    );
  });
};
