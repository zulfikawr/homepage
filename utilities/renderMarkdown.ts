import hljs from 'highlight.js/lib/core';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';

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

// Custom UI element rule: !![label](type:value:extra)!!
md.inline.ruler.push('markdown_ui', (state, silent) => {
  const marker = '!!';
  if (!state.src.startsWith(marker, state.pos)) return false;

  const match = state.src
    .slice(state.pos)
    .match(/^!!\[([^\]]+)\]\(([^:]+):([^:)]+)(?::([^)]+))?\)!!/);
  if (!match) return false;

  if (!silent) {
    const token = state.push('markdown_ui', '', 0);
    token.meta = {
      label: match[1],
      type: match[2],
      value: match[3],
      extra: match[4],
    };
  }

  state.pos += match[0].length;
  return true;
});

md.renderer.rules.markdown_ui = (tokens, idx) => {
  const { label, type, value, extra } = tokens[idx].meta;

  switch (type) {
    case 'toast':
      return `<button class="markdown-ui-btn" data-ui-type="toast" data-ui-value="${value}">${label}</button>`;
    case 'drawer':
      return `<button class="markdown-ui-btn" data-ui-type="drawer" data-ui-value="${value}">${label}</button>`;
    case 'tooltip':
      return `<span class="markdown-ui-tooltip" data-ui-text="${value}">${label}</span>`;
    case 'badge':
      return `<span class="markdown-ui-badge" data-ui-variant="${value}" data-ui-icon="${extra || ''}">${label}</span>`;
    case 'label':
      return `<span class="markdown-ui-label" data-ui-variant="${value}" data-ui-icon="${extra || ''}">${label}</span>`;
    case 'icon':
      return `<span class="markdown-ui-icon" data-ui-name="${value}" data-ui-size="${extra || '20'}"></span>`;
    default:
      return `!![${label}](${type}:${value})!!`;
  }
};

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
