import pluginVue from 'eslint-plugin-vue'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import vitest from '@vitest/eslint-plugin'

const compat = new FlatCompat()

export default [
  // https://eslint.vuejs.org/user-guide/
  ...pluginVue.configs['flat/recommended'],
  // https://eslint.org/docs/latest/use/configure/configuration-files#using-predefined-configurations
  js.configs.recommended,
  ...compat.extends(
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/tests/unit/**/*.spec.{j,t}s?(x)'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'vue/one-component-per-file': 'off',
    },
  },
  {
    files: ['tests/unit/**'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/valid-expect': ['off'],
    },
  },
]
