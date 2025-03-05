/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

var flattenColorPalette =
  require('tailwindcss/lib/util/flattenColorPalette').default;
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.tsx'],
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
      colors: {
        menu: '#ebeced',
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
        gray: colors.neutral,
      },
      boxShadow: {
        header: '0 4px 8px rgba(0,0,0,.04)',
      },
      width: {
        content: '680px',
        page: '720px',
        toc: '200px',
      },
      height: {
        img: '240px',
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
  plugins: [
    ({ addUtilities, theme }) => {
      const colors = flattenColorPalette(theme('borderColor'));
      delete colors['default'];

      const colorMap = Object.keys(colors).map((color) => ({
        [`.border-t-${color}`]: {
          borderTopColor: colors[color],
        },
        [`.border-r-${color}`]: {
          borderRightColor: colors[color],
        },
        [`.border-b-${color}`]: {
          borderBottomColor: colors[color],
        },
        [`.border-l-${color}`]: {
          borderLeftColor: colors[color],
        },
      }));
      const utilities = Object.assign({}, ...colorMap);

      addUtilities(utilities);
    },
    require('@tailwindcss/typography'),
  ],
};
