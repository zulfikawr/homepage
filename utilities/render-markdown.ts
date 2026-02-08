import { marked } from 'marked';
import Prism from 'prismjs';

const renderer = new marked.Renderer();

renderer.code = ({ text, lang }) => {
  const code = text;
  let highlighted = '';

  try {
    if (lang && Prism.languages[lang]) {
      highlighted = Prism.highlight(code, Prism.languages[lang], lang);
    } else {
      highlighted = code.replace(
        /[&<>"']/g,
        (m) =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          })[m] || m,
      );
    }
  } catch {
    highlighted = code.replace(
      /[&<>"']/g,
      (m) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[m] || m,
    );
  }

  if (lang) {
    return `<div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-lang">${lang}</span>
        <span class="code-copy-btn-wrapper" data-code="${encodeURIComponent(code)}">Wait...</span>
      </div>
      <pre class="language-${lang}"><code>${highlighted}</code></pre>
    </div>`;
  }

  return `<pre><code>${highlighted}</code></pre>`;
};

renderer.heading = ({ text, depth }) => {
  const slug = text.toLowerCase().replace(/[^\w]+/g, '-');
  return `<h${depth} id="${slug}">${text}</h${depth}>`;
};

renderer.table = ({ header, rows }) => {
  return `<div class="markdown-table-container"><table><thead>${header}</thead><tbody>${rows}</tbody></table></div>`;
};

marked.use({ renderer, gfm: true, breaks: false });

const uiPattern = /!!\[([^\]]+)\]\(([^:]+):([^:)]+)(?::([^)]+))?\)!!/g;

function processCustomUI(html: string): string {
  return html.replace(uiPattern, (_, label, type, value, extra) => {
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
  });
}

export function renderMarkdown(text: unknown): string {
  try {
    const safeText = typeof text === 'string' ? text : '';
    if (!safeText) return '';
    const html = marked.parse(safeText) as string;
    return processCustomUI(html);
  } catch {
    return '';
  }
}
