import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'


export default defineConfig([
  ...tseslint.configs.recommended,
  { files: [ '**/*.{js,mjs,cjs,ts}' ] },
  {
    rules: {
      'no-console': 'off',
      'semi': [ 'error', 'never' ],
      'comma-dangle': [ 'error', 'always-multiline' ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'destructuredArrayIgnorePattern': '^_',
          'ignoreRestSiblings': true,
          'args': 'after-used'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    }
  }
])
