import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },

  // -------------------------
  // SERVER (Node)
  // -------------------------
  {
    files: ['server/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      globals: globals.node,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'no-console': 'off',
      'no-unused-vars': 'warn',
    },
  },

  // -------------------------
  // CLIENT (React + Browser)
  // -------------------------
  {
    files: ['client/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      globals: globals.browser,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'no-unused-vars': 'warn',
    },
  },
])
