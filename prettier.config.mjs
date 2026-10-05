/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: true,
  printWidth: 140,
  // prettier-plugin-tailwindcss обязан быть последним
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],

  // Группы импортов: node → react/next → пакеты → слои FSD сверху вниз → относительные.
  // Side-effect импорты (например, './globals.css') не переставляются.
  importOrder: [
    '<BUILTIN_MODULES>',
    '^(react|react-dom)(/.*)?$',
    '^next(/.*)?$',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/app(/.*)?$',
    '^@/views(/.*)?$',
    '^@/widgets(/.*)?$',
    '^@/features(/.*)?$',
    '^@/entities(/.*)?$',
    '^@/shared(/.*)?$',
    '',
    '^[.]',
  ],
  // Порог для синтаксиса `import { type X }`, а не точная версия TypeScript
  importOrderTypeScriptVersion: '5.0.0',

  // Tailwind 4: плагину нужен CSS-entry, чтобы знать порядок классов
  tailwindStylesheet: './src/app/globals.css',
}

export default config
