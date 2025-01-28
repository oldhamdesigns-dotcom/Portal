import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import configPrettier from 'eslint-config-prettier';
import pluginTailwind from 'eslint-plugin-tailwindcss';
import eslintPluginReact from 'eslint-plugin-react';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: eslintPluginPrettier,
      tailwind: pluginTailwind,
      react: eslintPluginReact,
    },
    rules: {
      ...configPrettier.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      'react/jsx-curly-brace-presence': ['error', { props: 'always', children: 'always' }],
    },
  },
);
