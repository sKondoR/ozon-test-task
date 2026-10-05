import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

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
])

export default eslintConfig
