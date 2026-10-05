const isProd = process.env.NODE_ENV === 'production'

// Сборка для GitHub Pages: статический экспорт в out/ под подпутём репозитория.
// Включается переменной PAGES_BASE_PATH (её задаёт workflow), локально не влияет.
const pagesBasePath = process.env.PAGES_BASE_PATH

const nextConfig = {
  ...(pagesBasePath !== undefined && {
    output: 'export',
    basePath: pagesBasePath,
    trailingSlash: true, // /route/ → /route/index.html: так Pages отдаёт вложенные маршруты
    images: { unoptimized: true }, // у статического экспорта нет сервера оптимизации
  }),
  compiler: {
    removeConsole: isProd && { exclude: ['error', 'warn'] },
    reactRemoveProperties: isProd,
  },
  poweredByHeader: false, // не раскрываем X-Powered-By: Next.js
  experimental: {
    memoryBasedWorkersCount: true,
    staticGenerationRetryCount: 3,
    staticGenerationMaxConcurrency: 8,
    optimizePackageImports: ['@fortawesome/free-solid-svg-icons'],
  },
}

export default nextConfig
