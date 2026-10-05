// Архитектурные правила Feature-Sliced Design (https://feature-sliced.design)
//
// Слои сверху вниз (импортировать можно только из слоёв ниже):
//   app      — роутинг Next.js + провайдеры, глобальные стили (FSD-слой app)
//   views    — страницы (FSD-слой pages; переименован, чтобы Next не принял src/pages за Pages Router)
//   widgets  — крупные самостоятельные блоки страницы
//   features — пользовательские сценарии
//   entities — бизнес-сущности
//   shared   — переиспользуемый код без бизнес-логики (ui, lib, api, config)

const LAYERS = ['app', 'views', 'widgets', 'features', 'entities', 'shared']
// app и shared не делятся на слайсы
const SLICED_LAYERS = LAYERS.filter((layer) => layer !== 'app' && layer !== 'shared').join('|')

// Для каждого слоя запрещаем импорт из всех слоёв выше него
const layerRules = LAYERS.slice(1).map((layer, index) => ({
  name: `fsd-layer-${layer}`,
  comment: `Слой ${layer} не может импортировать из вышестоящих слоёв (${LAYERS.slice(0, index + 1).join(', ')})`,
  severity: 'error',
  from: { path: `^src/${layer}/` },
  to: { path: `^src/(${LAYERS.slice(0, index + 1).join('|')})/` },
}))

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    ...layerRules,
    {
      name: 'fsd-cross-slice',
      comment: 'Слайсы одного слоя не импортируют друг друга: общее выносите в слой ниже',
      severity: 'error',
      from: { path: `^src/(${SLICED_LAYERS})/([^/]+)/` },
      to: { path: '^src/$1/', pathNot: '^src/$1/$2/' },
    },
    {
      name: 'fsd-public-api',
      comment: 'Слайс импортируется извне только через публичный API (index.ts)',
      severity: 'error',
      from: { pathNot: `^src/(${SLICED_LAYERS})/[^/]+/` },
      to: {
        path: `^src/(${SLICED_LAYERS})/[^/]+/.+`,
        pathNot: `^src/(${SLICED_LAYERS})/[^/]+/index\\.tsx?$`,
      },
    },
    {
      name: 'fsd-public-api-from-slice',
      comment: 'Слайс импортируется извне только через публичный API (index.ts)',
      severity: 'error',
      from: { path: `^src/(${SLICED_LAYERS})/([^/]+)/` },
      to: {
        path: `^src/(${SLICED_LAYERS})/[^/]+/.+`,
        pathNot: [`^src/$1/$2/`, `^src/(${SLICED_LAYERS})/[^/]+/index\\.tsx?$`],
      },
    },
    {
      name: 'no-circular',
      comment: 'Циклические зависимости',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'not-to-unresolvable',
      comment: 'Импорт модуля, который не удаётся найти',
      severity: 'error',
      from: {},
      to: { couldNotResolve: true },
    },
    {
      name: 'no-non-package-json',
      comment: 'Импорт пакета, которого нет в package.json',
      severity: 'error',
      from: {},
      to: { dependencyTypes: ['npm-no-pkg', 'npm-unknown'] },
    },
    {
      name: 'not-to-dev-dep',
      comment: 'Код приложения не должен зависеть от devDependencies',
      severity: 'error',
      from: { path: '^src/', pathNot: '\\.(test|spec)\\.tsx?$' },
      to: { dependencyTypes: ['npm-dev'], dependencyTypesNot: ['type-only'] },
    },
    {
      name: 'no-orphans',
      comment: 'Модуль, который никто не импортирует (мёртвый код)',
      severity: 'warn',
      from: {
        orphan: true,
        pathNot: [
          '\\.d\\.ts$',
          '\\.(test|spec)\\.tsx?$',
          // Файлы-соглашения Next.js подхватываются фреймворком, а не импортом.
          // Роутинг — внутри src/app
          '^src/app/(.*/|)(page|layout|loading|error|not-found|global-error|forbidden|unauthorized|global-not-found|template|default|route|opengraph-image|twitter-image|icon|apple-icon|sitemap|robots|manifest)\\.tsx?$',
          // Уровень проекта — в корне src/
          '^src/(proxy|middleware|instrumentation|instrumentation-client)\\.ts$',
        ],
      },
      to: {},
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '^(\\.next|coverage|node_modules)/' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.d.ts'],
      mainFields: ['module', 'main', 'types', 'typings'],
    },
    reporterOptions: {
      text: { highlightFocused: true },
    },
  },
}
