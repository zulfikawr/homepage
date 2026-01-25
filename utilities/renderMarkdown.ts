import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import hljs from 'highlight.js/lib/core';

const md = new MarkdownIt({
  html: true,
  breaks: false,
  linkify: true,
  highlight: (code, lang) => {
    try {
      if (lang && hljs.getLanguage(lang)) {
        return `<pre class="hljs"><code>${
          hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      }
    } catch {
      // Ignored
    }
    return '';
  },
});

md.use(anchor, {
  slugify: (s: string) => s.toLowerCase().replace(/[^\w]+/g, '-'),
});

md.enable('table');

// Wrap tables in a scrollable container
md.renderer.rules.table_open = () =>
  '<div class="markdown-table-container"><table>';
md.renderer.rules.table_close = () => '</table></div>';

export function renderMarkdown(text: unknown): string {
  try {
    const safeText = typeof text === 'string' ? text : '';
    if (!safeText) return '';
    return md.render(safeText);
  } catch {
    return '';
  }
}
