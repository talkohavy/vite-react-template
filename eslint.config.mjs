import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import pluginCompiler from 'eslint-plugin-react-compiler';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    // when an `ignores` key is used without any other keys in the configuration object, then it acts as global `ignores`.
    ignores: ['dist', 'coverage', 'iframe-server'],
  },
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react-compiler': pluginCompiler,
      'react-hooks': pluginReactHooks,
      perfectionist,
      import: importPlugin,
    },
  },
  {
    rules: {
      // Error Rules
      // -----------
      'react-compiler/react-compiler': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-duplicates': ['error', { 'prefer-inline': false }],
      // Named specifiers: values before inline `type` imports; do not reorder import lines (perfectionist/sort-imports owns that).
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external', 'internal', 'unknown', 'parent', 'sibling', 'index', 'object', 'type']],
          'newlines-between': 'ignore',
          alphabetize: {
            order: 'ignore',
            caseInsensitive: true,
          },
          named: {
            enabled: true,
            types: 'types-last',
          },
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'all',
          argsIgnorePattern: '(^_|^req$|^res$|^next$)',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: false,
          varsIgnorePattern: '^React$',
        },
      ],
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'alphabetical',
          order: 'asc',
          sortBy: 'path', // <--- defaults to 'path'. Options are: 'path' | 'specifier'
          ignoreCase: true,
          specialCharacters: 'keep',
          internalPattern: ['^@src/.+', '^~/.+'], // <--- defaults to default: ['^~/.+', '^@/.+']. Specifies a pattern for identifying internal imports. This is useful for distinguishing your own modules from external dependencies.
          partitionByComment: false,
          newlinesBetween: 0, // <--- number | 'ignore' (0 = no newlines, 1 = one newline, etc.)
          maxLineLength: undefined,
          groups: [
            'react',
            'builtin', // <--- import fs from 'fs';
            'external', // <--- import express from 'express';
            'internal', // <--- import myUtil from '@src/myUtil';
            ['parent', 'sibling', 'index'],
            'type-internal',
            'type',
            ['type-parent', 'type-sibling', 'type-index'],
            'unknown',
          ],
          customGroups: [
            {
              groupName: 'react',
              selector: 'type',
              elementNamePattern: ['^react$', '^react-.+'],
            },
            {
              groupName: 'react',
              elementNamePattern: ['^react$', '^react-.+'],
            },
          ],
          environment: 'node', // <--- Possible Options: 'node' | 'bun'
        },
      ],

      // Warning Rules
      // -------------
      'no-debugger': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',

      // Off Rules
      // -------------
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'preserve-caught-error': 'off',

      // Notes
      // -----
      // 'sort-imports': [ <--- DO NOT ENABLE! Collides with perfectionist/sort-imports
      //   'error',
      //   {
      //     ignoreCase: false,
      //     ignoreDeclarationSort: false,
      //     ignoreMemberSort: false,
      //     memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      //     allowSeparatedGroups: false,
      //   },
      // ],
      // 'sort-keys': ['error', 'asc', { caseSensitive: true, natural: false, minKeys: 2 }], <--- DO NOT ENABLE! Collides with perfectionist/sort-imports
    },
  },
];
