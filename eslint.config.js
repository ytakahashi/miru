import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import vueEsPrettierConfig from '@vue/eslint-config-prettier'
import vitest from '@vitest/eslint-plugin'

export default defineConfigWithVueTs(
  // https://typescript-eslint.io/getting-started
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // https://eslint.vuejs.org/user-guide/
  pluginVue.configs['flat/strongly-recommended'],
  // https://github.com/vuejs/eslint-config-typescript
  vueTsConfigs.recommended,
  vueEsPrettierConfig,
  {
    rules: {
      'no-console': 'warn',
      'vue/component-name-in-template-casing': ['warn', 'PascalCase'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  {
    files: ['**/tests/unit/**/*.spec.{j,t}s?(x)'],
    rules: {
      'vue/one-component-per-file': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
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
  }
)
