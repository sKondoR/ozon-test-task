# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Тестовое задание на Next.js 16 (App Router, Turbopack) + React 19 + React Compiler + TypeScript strict + Tailwind 4. Серверные данные на клиенте — через `@tanstack/react-query`, запросы — нативным `fetch` (axios в проекте намеренно нет).

## Команды

```bash
npm run dev               # dev-сервер на http://localhost:4321 (start — тоже 4321)
npm run build             # прод-сборка (включает проверку типов)
npm run lint              # ESLint (eslint-config-next: core-web-vitals + typescript)
npm run lint:arch         # dependency-cruiser: проверка FSD-правил импортов
npm run lint:arch:report  # то же, HTML-отчёт в dependency-report.html
npm run format            # Prettier: отформатировать всё
npm run format:check      # Prettier: только проверка (запускается в CI)
npx tsc --noEmit          # только проверка типов

npm test                         # Vitest (по умолчанию в watch-режиме)
npx vitest run path/to/file.test.ts      # один файл, однократно
npx vitest run -t "название теста"       # один тест по имени
npm run test:coverage
```

После изменений кода проверяй `npx tsc --noEmit` и `npm run lint`; `lint:arch` — если менялись импорты или структура слайсов. `npm run build` запускай только при изменениях конфигов, роутинга или того, что влияет на static export, и обрезай вывод: `npm run build 2>&1 | tail -30`.

## Перед push / PR

Полная проверка — только перед push в `main`, перед созданием PR или по явной просьбе пользователя:

1. Запусти `/simplify` и примени исправления.
2. Запусти `/code-review` по изменениям; найденные проблемы исправь или явно перечисли пользователю.
3. Прогони `lint`, `lint:arch` и `build` (вывод сборки обрезай, как выше).

Перед обычным локальным коммитом эти шаги не запускай — достаточно pre-commit-хука (см. ниже). Если пользователь собирается пушить или открывать PR, предложи выполнить их.

Любой коммит любой коммит (в том числе из VS Code) проходит husky-хук `.husky/pre-commit`: `lint-staged` (`.lintstagedrc.mjs`: `eslint --fix` + `prettier --write` по застейдженным файлам), затем `tsc --noEmit` и `lint:arch` по всему проекту — если коммит затрагивает JS/TS, включая удаление файлов. Коммит только документации/конфигов идёт без проверки типов и архитектуры. Пропустить хук — `git commit --no-verify`.

## Деплой

Push в `main` → `.github/workflows/deploy.yml`: lint, lint:arch, тесты, сборка и публикация на GitHub Pages (`https://skondor.github.io/ozon-test-task/`). Workflow срабатывает, только если в push изменился `package.json` и `version` в нём выросла относительно предыдущего состояния `main` (поднимать через `npm version patch|minor|major`); вручную — `workflow_dispatch` без проверки версии. Статический экспорт (`output: 'export'`, `basePath`) включается в `next.config.mjs` только при заданной `PAGES_BASE_PATH`, поэтому код должен оставаться совместимым со static export: без route handlers, server actions, `cookies()`/`headers()` и т. п. Для `next/image` с локальным `src` добавляй префикс `basePath` вручную.

## Дизайн-идеи

Если пользователь просит сгенерировать дизайн или попробовать варианты дизайна — создавай самостоятельные HTML-файлы в `design-ideas/NN/`, где `NN` — следующий свободный двузначный номер (`01`, `02`, `03`, …). Каждый новый запрос — новая папка; существующие не перезаписывай. Код приложения в `src/` при этом не трогай, пока пользователь не выберет вариант и не попросит его внедрить.

## Архитектура: Feature-Sliced Design

Слои в `src/` сверху вниз; импортировать можно **только из слоёв ниже**:

| Слой       | Назначение                                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------------- |
| `app`      | Роутинг Next.js **и** FSD-слой app (провайдеры, глобальные стили)                                                     |
| `views`    | FSD-слой _pages_. Назван `views`, потому что `src/pages` Next считает Pages Router и превращает каждый файл в маршрут |
| `widgets`  | Крупные самостоятельные блоки страницы                                                                                |
| `features` | Пользовательские сценарии                                                                                             |
| `entities` | Бизнес-сущности                                                                                                       |
| `shared`   | Код без бизнес-логики (ui, lib, api, config); слайсов нет, только сегменты                                            |

Правила, которые проверяет `.dependency-cruiser.js` (нарушение = ошибка `lint:arch`):

- импорт из вышестоящего слоя запрещён;
- слайсы одного слоя (`features/a` → `features/b`) не импортируют друг друга — общее выносится ниже;
- снаружи слайс импортируется только через его `index.ts` (`@/entities/user`, не `@/entities/user/model/store`);
- запрещены циклы, неразрешимые импорты, пакеты вне `package.json` и devDependencies в коде приложения.

Файлы `src/app/**/page.tsx` и `layout.tsx` держи тонкими: страница собирается в `views` и реэкспортируется/рендерится из `app`.

`src/app/providers.tsx` — клиентский компонент с `QueryClientProvider` (`staleTime` 60 с); подключён в корневом `layout.tsx`.

## Конфигурация

- Форматирование — Prettier, все настройки (включая порядок групп импортов) — в `prettier.config.mjs`; плагины сортируют импорты и классы Tailwind. Стилистику не настраивай в ESLint: `eslint-config-prettier` подключён последним в `eslint.config.mjs` и отключает конфликтующие правила.
- Единственный алиас — `@/*` → `src/*` (задаётся в `paths` в `tsconfig.json`, Vitest читает его через `resolve.tsconfigPaths`).
- Tailwind 4 настраивается в CSS (`src/app/globals.css`, директивы `@theme`/`@source`), JS-конфига нет; подключён через `@tailwindcss/postcss`. Сканируется только `src` (`source('..')` в `@import`). ESLint ужесточает `@next/next/no-img-element` до `error` — изображения только через `next/image`.
- `tsconfig` строгий: `noUnusedLocals`, `noUnusedParameters`, `noUncheckedSideEffectImports`.
- ESLint закреплён на 9.x: плагины внутри `eslint-config-next` пока не поддерживают ESLint 10.
- Vitest работает в `jsdom` с `@vitejs/plugin-react`; для тестов компонентов — `@testing-library/react` и `@testing-library/user-event`. `vitest.setup.ts` подключает матчеры `@testing-library/jest-dom` и вызывает `cleanup()` после каждого теста (`globals` выключены — `test`/`expect` импортируй из `vitest`). Файл включён в `tsconfig.json`, чтобы `tsc` видел типы матчеров.

Уточнение к блоку ниже (сам блок перезаписывается `next dev`, поэтому правило вынесено сюда): читай гайды в `node_modules/next/dist/docs/` не перед каждой правкой, а только когда работаешь с API, конфигом или конвенцией Next.js, в поведении которых в этой версии есть сомнения. Читай только нужный гайд, а не весь каталог.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
