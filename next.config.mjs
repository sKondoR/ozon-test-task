const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
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
