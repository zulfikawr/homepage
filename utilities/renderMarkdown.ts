import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const md = new MarkdownIt({
  html: true,
  breaks: false,
  linkify: true,
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
      } catch (_) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
  },
});

md.enable('table');

export function renderMarkdown(text: unknown): string {
  try {
    const safeText = typeof text === 'string' ? text : '';
    if (!safeText) return '';
    return md.render(safeText);
  } catch (err) {
    console.error('Markdown rendering failed:', err);
    return '<p style="color:red;">Preview error: Invalid markdown content</p>';
  }
}
