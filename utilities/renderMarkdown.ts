import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import hljs from 'highlight.js';

const md = new MarkdownIt({
  html: true,
  breaks: false,
  linkify: true,
  highlight: (code, lang) => {
    try {
      if (lang && hljs.getLanguage(lang)) {
        return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
      }
    } catch (e) {
      console.error('Highlight.js error:', e);
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
  },
});

md.use(anchor, {
  slugify: (s: string) => s.toLowerCase().replace(/[^\w]+/g, '-'),
});

md.enable('table');

export function renderMarkdown(text: unknown): string {
  try {
    const safeText = typeof text === 'string' ? text : '';
    if (!safeText) return '';
    return md.render(safeText);
  } catch (err) {
    console.error('Markdown rendering failed:', err);
    return '';
  }
}
