const typography = require('@tailwindcss/typography');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        1: '3px',
        2: '6px',
        3: '9px',
        4: '12px',
        4.5: '1rem',
        6: '18px',
        7: '21px',
        9: '27px',
        10: '30px',
        20: '60px',
      },
      boxShadow: {
        header: '0 4px 8px rgba(0,0,0,.04)',
      },
      width: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        blog: '920px',
        content: '680px',
        page: '720px',
        toc: '200px',
      },
      height: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
      },
      minHeight: {
        main: 'calc(100vh - 6.65rem)',
      },
      fontSize: {
        1: '32px',
        2: '18px',
        3: '15px',
        4: '14px',
        5: '12px',
      },
    },
  },
  plugins: [typography],
};
