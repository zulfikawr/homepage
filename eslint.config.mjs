import nextConfig from 'eslint-config-next';
import coreWebVitalsConfig from 'eslint-config-next/core-web-vitals';
import typescriptConfig from 'eslint-config-next/typescript';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...nextConfig,
  ...coreWebVitalsConfig,
  ...typescriptConfig,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. React, Next, and other external packages
            ['^react', '^next', '^@?\\w'],
            // 2. Internal Aliases (@/components, @/hooks, etc.)
            ['^@/'],
            // 3. Side effect imports (e.g. import "./style.css")
            ['^\\u0000'],
            // 4. Parent/Relative imports
            [
              '^\\.\\.(?!/?$)',
              '^\\.\\./?$',
              '^\\./(?=.*!/)',
              '^\\./(?=.*$)',
              '^\\./?$',
            ],
            // 5. Style imports
            ['^.+\\.s?css$'],
          ],
        },
      ],
    },
  },
];

export default config;
