import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

/** @type {import('eslint').Linter.Config[]} */
export default [
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      'no-console': 'warn',
      'prettier/prettier': 'error',
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
