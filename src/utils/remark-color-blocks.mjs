import { visit } from 'unist-util-visit';

const SUPPORTED_COLORS = new Set([
  'slate',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'gray',
]);

const COLOR_ALIASES = {
  tip: 'blue',
  info: 'blue',
  note: 'gray',
  right: 'green',
};

const normalizeColor = name => {
  const key = String(name).toLowerCase();
  const color = COLOR_ALIASES[key] ?? key;

  return SUPPORTED_COLORS.has(color) ? color : undefined;
};

export default function remarkColorBlocks() {
  return tree => {
    visit(tree, ['containerDirective', 'leafDirective', 'textDirective'], node => {
      const color = normalizeColor(node.name);

      if (!color) return;

      node.data = {
        ...node.data,
        hName: 'div',
        hProperties: {
          ...node.data?.hProperties,
          className: ['color-block', `color-block--${color}`],
          dataColorBlock: color,
        },
      };
    });
  };
}
