import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    files: ['**/*.{js,mjs,cjs,ts}', '**/*.spec.{js,mjs,cjs,ts}'],
    rules: {
      'sort-imports': 'error'
    }
  },
  stylistic.configs['disable-legacy'],
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  stylistic.configs['disable-legacy'],
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    commaDangle: 'never'
  }),
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/max-len': [
        'error',
        { ignorePattern: '^import|^\\s+\'.+(\'|\',)$' }
      ]
    }
  }
];

export default config;
