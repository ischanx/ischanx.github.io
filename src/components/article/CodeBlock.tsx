import { useEffect, useRef, useState } from 'react';

interface CodeBlockProps {
  highlightedHtml: string;
  language: string;
  originalText: string;
}

interface ScrollAreaWindow extends Window {
  initScrollAreas?: () => void;
}

const initScrollAreas = () => {
  (window as ScrollAreaWindow).initScrollAreas?.();
};

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function CodeBlock({
  highlightedHtml,
  language,
  originalText,
}: CodeBlockProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    scrollAreaRef.current
      ?.querySelectorAll<HTMLElement>('code')
      .forEach(code => {
        const lineCount = Math.max(code.children.length, 1);
        const maxDigits = lineCount.toString().length;

        code.setAttribute('data-line-numbers', 'true');
        code.setAttribute('data-line-numbers-max-digits', maxDigits.toString());
      });
    requestAnimationFrame(initScrollAreas);
  }, [highlightedHtml]);

  const copyCode = () => {
    navigator.clipboard
      .writeText(originalText)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('无法复制文本: ', err);
      });
  };

  return (
    <figure className="code-block">
      <span className="code-block__language">{language}</span>
      <button
        className="code-block__copy"
        type="button"
        title="复制代码"
        aria-label={`复制 ${language} 代码`}
        onClick={copyCode}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      <div
        ref={scrollAreaRef}
        className="scroll-area code-block__scroll"
        data-scroll-area
        data-scroll-area-orientation="horizontal"
      >
        <div className="scroll-area__viewport" data-scroll-area-viewport>
          <div
            className="scroll-area__content"
            data-scroll-area-content
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </div>
        <div
          className="scroll-area__scrollbar"
          data-scroll-area-track
          aria-hidden="true"
        >
          <div className="scroll-area__thumb" data-scroll-area-thumb />
        </div>
      </div>
    </figure>
  );
}
