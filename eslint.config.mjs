import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // .next, out, build и next-env.d.ts уже игнорирует eslint-config-next
  globalIgnores(['coverage/**']),
  {
    rules: {
      // Ужесточаем с warn: изображения только через next/image
      '@next/next/no-img-element': 'error',
    },
  },
  // Последним: отключает правила ESLint, конфликтующие с форматированием Prettier
  prettier,
])

export default eslintConfig
