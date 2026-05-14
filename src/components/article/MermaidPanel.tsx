import { Check, Copy } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { initArticleScrollAreas } from '../../utils/article/code-blocks';

const MERMAID_LIGHT_BACKGROUND = '#ffffff';
const MERMAID_DARK_BACKGROUND = 'rgb(23 23 23)';

interface MermaidPanelProps {
  graphDefinition: string;
  highlightedPre: HTMLElement;
}

const getMermaidBackground = (element?: Element | null) => {
  if (element) {
    const background = getComputedStyle(element)
      .getPropertyValue('--mermaid-background')
      .trim();

    if (background) return background;
  }

  return document.documentElement.classList.contains('dark')
    ? MERMAID_DARK_BACKGROUND
    : MERMAID_LIGHT_BACKGROUND;
};

const getMermaidThemeVariables = () => {
  const background = getMermaidBackground();
  const isDark = document.documentElement.classList.contains('dark');

  const lightTheme = {
    background,
    mainBkg: background,
    primaryColor: '#f8fafc',
    primaryTextColor: '#111827',
    primaryBorderColor: '#94a3b8',
    secondaryColor: '#e0f2fe',
    secondaryTextColor: '#0f172a',
    secondaryBorderColor: '#38bdf8',
    tertiaryColor: '#ecfdf5',
    tertiaryTextColor: '#0f172a',
    tertiaryBorderColor: '#34d399',
    noteBkgColor: '#fffbeb',
    noteTextColor: '#111827',
    noteBorderColor: '#f59e0b',
    lineColor: '#475569',
    textColor: '#111827',
    titleColor: '#111827',
    edgeLabelBackground: background,
    clusterBkg: '#f1f5f9',
    clusterBorder: '#94a3b8',
    defaultLinkColor: '#475569',
    nodeBorder: '#94a3b8',
    actorBkg: '#f8fafc',
    actorBorder: '#94a3b8',
    actorTextColor: '#111827',
    actorLineColor: '#64748b',
    signalColor: '#475569',
    signalTextColor: '#111827',
    labelBoxBkgColor: '#f8fafc',
    labelBoxBorderColor: '#94a3b8',
    labelTextColor: '#111827',
    loopTextColor: '#111827',
    activationBkgColor: '#e0f2fe',
    activationBorderColor: '#38bdf8',
    sequenceNumberColor: '#ffffff',
    sectionBkgColor: '#e0f2fe',
    altSectionBkgColor: '#f8fafc',
    sectionBkgColor2: '#ecfdf5',
    taskBorderColor: '#94a3b8',
    taskBkgColor: '#f8fafc',
    taskTextColor: '#111827',
    taskTextLightColor: '#334155',
    taskTextOutsideColor: '#111827',
    taskTextClickableColor: '#0369a1',
    activeTaskBorderColor: '#0ea5e9',
    activeTaskBkgColor: '#e0f2fe',
    gridColor: '#cbd5e1',
    doneTaskBkgColor: '#dcfce7',
    doneTaskBorderColor: '#22c55e',
    critBorderColor: '#ef4444',
    critBkgColor: '#fee2e2',
    todayLineColor: '#ef4444',
    labelColor: '#111827',
    errorBkgColor: '#fee2e2',
    errorTextColor: '#991b1b',
    fontFamily: 'system-ui, sans-serif',
  };

  if (!isDark) return lightTheme;

  return {
    ...lightTheme,
    primaryColor: '#262626',
    primaryTextColor: '#e5e5e5',
    primaryBorderColor: '#737373',
    secondaryColor: '#303030',
    secondaryTextColor: '#f5f5f5',
    secondaryBorderColor: '#a3a3a3',
    tertiaryColor: '#262626',
    tertiaryTextColor: '#f5f5f5',
    tertiaryBorderColor: '#737373',
    noteBkgColor: '#303030',
    noteTextColor: '#f5f5f5',
    lineColor: '#a3a3a3',
    textColor: '#e5e5e5',
    titleColor: '#e5e5e5',
    clusterBkg: '#262626',
    clusterBorder: '#737373',
    defaultLinkColor: '#a3a3a3',
    nodeBorder: '#737373',
    actorBkg: '#262626',
    actorBorder: '#a3a3a3',
    actorTextColor: '#e5e5e5',
    actorLineColor: '#737373',
    signalColor: '#a3a3a3',
    signalTextColor: '#e5e5e5',
    labelBoxBkgColor: '#262626',
    labelBoxBorderColor: '#a3a3a3',
    labelTextColor: '#e5e5e5',
    loopTextColor: '#e5e5e5',
    activationBkgColor: '#303030',
    activationBorderColor: '#a3a3a3',
    sectionBkgColor: '#303030',
    altSectionBkgColor: '#262626',
    sectionBkgColor2: '#262626',
    taskBorderColor: '#737373',
    taskBkgColor: '#262626',
    taskTextColor: '#e5e5e5',
    taskTextLightColor: '#d4d4d4',
    taskTextOutsideColor: '#e5e5e5',
    taskTextClickableColor: '#f5f5f5',
    activeTaskBorderColor: '#a3a3a3',
    activeTaskBkgColor: '#303030',
    gridColor: '#525252',
    doneTaskBkgColor: '#262626',
    critBkgColor: '#303030',
    labelColor: '#e5e5e5',
    errorBkgColor: '#303030',
    errorTextColor: '#f5f5f5',
  };
};

const getSvgSize = (svg: SVGSVGElement) => {
  const viewBox = svg.viewBox.baseVal;

  if (viewBox.width && viewBox.height) {
    return { width: viewBox.width, height: viewBox.height };
  }

  const rect = svg.getBoundingClientRect();

  return {
    width: rect.width || 800,
    height: rect.height || 600,
  };
};

const ensureMermaidSvgBackground = (svg: SVGSVGElement) => {
  const { width, height } = getSvgSize(svg);
  const background = svg.querySelector<SVGRectElement>(
    ':scope > rect.mermaid-background'
  );
  const backgroundColor = getMermaidBackground(svg.closest('.mermaid'));
  const rect =
    background ||
    document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  rect.setAttribute('class', 'mermaid-background');
  rect.setAttribute('x', '0');
  rect.setAttribute('y', '0');
  rect.setAttribute('width', String(width));
  rect.setAttribute('height', String(height));
  rect.setAttribute('fill', backgroundColor);

  if (!background) {
    svg.insertBefore(rect, svg.firstChild);
  }

  svg.style.background = backgroundColor;
};

const createSafeSvgMarkup = (svg: SVGSVGElement) => {
  const { width, height } = getSvgSize(svg);
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const background = getMermaidBackground(svg.closest('.mermaid'));

  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  clone.setAttribute(
    'style',
    `${clone.getAttribute('style') || ''};background:${background};`
  );

  clone.querySelectorAll('image').forEach(node => {
    const href =
      node.getAttribute('href') || node.getAttribute('xlink:href') || '';

    if (href && !href.startsWith('data:')) {
      node.remove();
    }
  });

  ensureMermaidSvgBackground(clone);

  return {
    markup: new XMLSerializer().serializeToString(clone),
    width,
    height,
  };
};

const createMermaidPngUrl = (svg: SVGSVGElement) =>
  new Promise<string>((resolve, reject) => {
    const { markup, width, height } = createSafeSvgMarkup(svg);
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();
    const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      markup
    )}`;

    if (!context) {
      reject(new Error('Canvas is not supported.'));
      return;
    }

    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);
    context.scale(scale, scale);
    context.fillStyle = getMermaidBackground(svg.closest('.mermaid'));
    context.fillRect(0, 0, width, height);

    image.onload = () => {
      context.drawImage(image, 0, 0, width, height);
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Failed to create Mermaid preview PNG.'));
          return;
        }

        resolve(URL.createObjectURL(blob));
      }, 'image/png');
    };

    image.onerror = () => {
      reject(new Error('Failed to load Mermaid SVG into canvas.'));
    };

    image.src = svgDataUrl;
  });

const createMermaidSvgUrl = (svg: SVGSVGElement) =>
  URL.createObjectURL(
    new Blob([createSafeSvgMarkup(svg).markup], {
      type: 'image/svg+xml;charset=utf-8',
    })
  );

const openMermaidPreview = async (diagram: HTMLElement) => {
  const svg = diagram.querySelector('svg');

  if (!svg) return;

  let src: string;

  try {
    src = await createMermaidPngUrl(svg);
  } catch (error) {
    console.warn('Mermaid PNG 预览生成失败，降级为 SVG 预览:', error);
    src = createMermaidSvgUrl(svg);
  }

  const image = document.createElement('img');
  const source = document.createElement('div');

  image.alt = 'Mermaid 图表预览';
  image.src = src;
  source.className = 'mermaid-viewer-source';
  source.appendChild(image);
  document.body.appendChild(source);

  import('viewerjs').then(({ default: Viewer }) => {
    const viewer = new Viewer(source, {
      backdrop: true,
      movable: true,
      navbar: false,
      title: false,
      toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        prev: 0,
        play: 0,
        next: 0,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1,
      },
      hidden() {
        viewer.destroy();
        source.remove();
        URL.revokeObjectURL(src);
      },
      viewed() {
        const viewerImage = document.querySelector<HTMLImageElement>(
          '.viewer-canvas img'
        );

        if (!viewerImage?.naturalWidth || !viewerImage.naturalHeight) return;

        const widthRatio = (window.innerWidth * 0.9) / viewerImage.naturalWidth;
        const heightRatio =
          (window.innerHeight * 0.9) / viewerImage.naturalHeight;
        const fitRatio = Math.min(widthRatio, heightRatio);

        viewer.zoomTo(Math.min(fitRatio, 1));
      },
    });

    viewer.view(0);
  });
};

function MermaidCodeBlock({ highlightedPre }: Pick<MermaidPanelProps, 'highlightedPre'>) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const code = highlightedPre.querySelector<HTMLElement>('code');

    if (code) {
      const lineCount = Math.max(code.children.length, 1);
      const maxDigits = lineCount.toString().length;

      code.setAttribute('data-line-numbers', 'true');
      code.setAttribute('data-line-numbers-max-digits', maxDigits.toString());
    }

    contentRef.current?.replaceChildren(highlightedPre);
    requestAnimationFrame(initArticleScrollAreas);
  }, [highlightedPre]);

  return (
    <div
      className="scroll-area mermaid-code-block__scroll"
      data-scroll-area
      data-scroll-area-orientation="horizontal"
    >
      <div
        className="scroll-area__viewport mermaid-code-block__viewport"
        data-scroll-area-viewport
      >
        <div
          ref={contentRef}
          className="scroll-area__content mermaid-code-block__content"
          data-scroll-area-content
        />
      </div>
      <div
        className="scroll-area__scrollbar mermaid-code-block__scrollbar"
        data-scroll-area-track
        aria-hidden="true"
      >
        <div
          className="scroll-area__thumb mermaid-code-block__thumb"
          data-scroll-area-thumb
        />
      </div>
    </div>
  );
}

export default function MermaidPanel({
  graphDefinition,
  highlightedPre,
}: MermaidPanelProps) {
  const graphId = useId().replaceAll(':', '-');
  const diagramRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<'diagram' | 'code'>('diagram');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    import('mermaid')
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'base',
          themeVariables: getMermaidThemeVariables(),
        });

        const { svg, bindFunctions } = await mermaid.render(
          `mermaid-${graphId}`,
          graphDefinition
        );

        if (cancelled || !diagramRef.current) return;

        diagramRef.current.innerHTML = svg;
        const renderedSvg =
          diagramRef.current.querySelector<SVGSVGElement>('svg');

        if (renderedSvg) {
          ensureMermaidSvgBackground(renderedSvg);
        }

        bindFunctions?.(diagramRef.current);
      })
      .catch(error => {
        console.error('Mermaid 图表渲染失败:', error);
      });

    return () => {
      cancelled = true;
    };
  }, [graphDefinition, graphId]);

  useEffect(() => {
    if (activeView === 'code') {
      requestAnimationFrame(initArticleScrollAreas);
    }
  }, [activeView]);

  const copyMermaidCode = () => {
    navigator.clipboard
      .writeText(graphDefinition)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('无法复制 Mermaid 代码: ', err);
      });
  };

  const openPreview = () => {
    if (diagramRef.current) {
      openMermaidPreview(diagramRef.current);
    }
  };

  return (
    <div className="mermaid-panel">
      <div className="mermaid-toolbar">
        <div className="mermaid-toggle-group">
          <button
            className={`mermaid-toggle${activeView === 'diagram' ? ' is-active' : ''}`}
            type="button"
            onClick={() => setActiveView('diagram')}
          >
            图片
          </button>
          <button
            className={`mermaid-toggle${activeView === 'code' ? ' is-active' : ''}`}
            type="button"
            onClick={() => setActiveView('code')}
          >
            代码
          </button>
        </div>
        <button
          className="mermaid-copy"
          type="button"
          title="复制 Mermaid 代码"
          aria-label="复制 Mermaid 代码"
          onClick={copyMermaidCode}
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </button>
      </div>
      <div
        ref={diagramRef}
        className="mermaid"
        aria-label="Mermaid diagram"
        role="button"
        tabIndex={0}
        title="点击放大预览"
        hidden={activeView !== 'diagram'}
        onClick={openPreview}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPreview();
          }
        }}
      >
        {graphDefinition}
      </div>
      <div className="mermaid-code-view" hidden={activeView !== 'code'}>
        <MermaidCodeBlock highlightedPre={highlightedPre} />
      </div>
    </div>
  );
}
