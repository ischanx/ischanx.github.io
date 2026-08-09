import { visit } from 'unist-util-visit';

const getText = node => {
  if (typeof node.value === 'string') return node.value;
  if (!Array.isArray(node.children)) return '';
  return node.children.map(getText).join('');
};

const slugify = value =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{Letter}\p{Number}_-]/gu, '');

export default function remarkHeadingIds() {
  return tree => {
    const occurrences = new Map();

    visit(tree, 'heading', node => {
      const base = slugify(getText(node));
      if (!base) return;

      const occurrence = occurrences.get(base) ?? 0;
      occurrences.set(base, occurrence + 1);
      const id = occurrence === 0 ? base : `${base}-${occurrence}`;

      node.data = {
        ...node.data,
        hProperties: {
          ...node.data?.hProperties,
          id,
        },
      };
    });
  };
}
