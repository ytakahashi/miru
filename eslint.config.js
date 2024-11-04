import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import vueEsPrettierConfig from '@vue/eslint-config-prettier'
import vitest from '@vitest/eslint-plugin'

export default tseslint.config(
  // https://typescript-eslint.io/getting-started
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // https://eslint.vuejs.org/user-guide/
  ...pluginVue.configs['flat/recommended'],
  // https://github.com/vuejs/eslint-config-typescript
  ...vueTsEslintConfig(),
  ...pluginVue.configs['flat/recommended'],
  vueEsPrettierConfig,
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
  }
)
