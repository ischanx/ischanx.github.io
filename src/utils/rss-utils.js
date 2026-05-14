import { marked } from 'marked';

/**
 * 将Markdown转换为HTML，并用CDATA包装
 * @param {string} markdown Markdown内容
 * @returns {string} 包装在CDATA中的HTML内容
 */
export function markdownToCDATAHTML(markdown) {
  const html = marked(markdown);
  return `<![CDATA[${html}]]>`;
}

/**
 * 将HTML内容包装在CDATA中
 * @param {string} html HTML内容
 * @returns {string} 包装在CDATA中的HTML内容
 */
export function wrapInCDATA(html) {
  return `<![CDATA[${html}]]>`;
}
