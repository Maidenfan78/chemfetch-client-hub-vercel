import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: ['dist/*', 'node_modules/*', '.next/*', 'out/*'],
    rules: {
      // React best practices
      'react/prop-types': 'off', // Using TypeScript
      'react/display-name': 'warn',
      'react/no-unescaped-entities': 'error',

      // General JavaScript best practices
      'no-console': 'off', // Allow console for debugging
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: 'error',
      curly: 'error',

      // TypeScript - more lenient for development and deployment
      '@typescript-eslint/no-explicit-any': 'off', // Allow any for deployment
      '@typescript-eslint/no-unused-vars': 'warn', // Warn but don't error
    },
  },
];

export default eslintConfig;
