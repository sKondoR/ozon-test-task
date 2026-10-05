# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Тестовое задание на Next.js 16 (App Router, Turbopack) + React 19 + TypeScript strict + Tailwind 3. Серверные данные на клиенте — через `@tanstack/react-query`, запросы — нативным `fetch` (axios в проекте намеренно нет).

## Команды

```bash
npm run dev               # dev-сервер на http://localhost:4321 (start — тоже 4321)
npm run build             # прод-сборка (включает проверку типов)
npm run lint              # ESLint (eslint-config-next: core-web-vitals + typescript)
npm run lint:arch         # dependency-cruiser: проверка FSD-правил импортов
npm run lint:arch:report  # то же, HTML-отчёт в dependency-report.html
npx tsc --noEmit          # только проверка типов

npm test                         # Vitest (по умолчанию в watch-режиме)
npx vitest run path/to/file.test.ts      # один файл, однократно
npx vitest run -t "название теста"       # один тест по имени
npm run test:coverage
```

После изменений прогоняй `lint`, `lint:arch` и `build`.

## Перед коммитом

Перед каждым коммитом (и перед предложением закоммитить) обязательно:
1. Запусти `/simplify` и примени исправления.
2. Запусти `/code-review` по незакоммиченным изменениям; найденные проблемы исправь или явно перечисли пользователю.
3. Снова прогони `lint`, `lint:arch` и `build`.

Если пользователь говорит, что закончил задачу или собирается коммитить сам, предложи выполнить эти шаги до коммита.

Независимо от этого любой коммит (в том числе из VS Code) проходит husky-хук `.husky/pre-commit`: `lint`, `lint:arch`, `tsc --noEmit`. Пропустить хук — `git commit --no-verify`.

## Деплой

Push в `main` → `.github/workflows/deploy.yml`: lint, lint:arch, тесты, сборка и публикация на GitHub Pages (`https://skondor.github.io/ozon-test-task/`). Workflow срабатывает, только если в push изменился `package.json` и `version` в нём выросла относительно предыдущего состояния `main` (поднимать через `npm version patch|minor|major`); вручную — `workflow_dispatch` без проверки версии. Статический экспорт (`output: 'export'`, `basePath`) включается в `next.config.mjs` только при заданной `PAGES_BASE_PATH`, поэтому код должен оставаться совместимым со static export: без route handlers, server actions, `cookies()`/`headers()` и т. п. Для `next/image` с локальным `src` добавляй префикс `basePath` вручную.

## Дизайн-идеи

Если пользователь просит сгенерировать дизайн или попробовать варианты дизайна — создавай самостоятельные HTML-файлы в `design-ideas/NN/`, где `NN` — следующий свободный двузначный номер (`01`, `02`, `03`, …). Каждый новый запрос — новая папка; существующие не перезаписывай. Код приложения в `src/` при этом не трогай, пока пользователь не выберет вариант и не попросит его внедрить.

## Архитектура: Feature-Sliced Design

Слои в `src/` сверху вниз; импортировать можно **только из слоёв ниже**:

| Слой | Назначение |
|---|---|
| `app` | Роутинг Next.js **и** FSD-слой app (провайдеры, глобальные стили) |
| `views` | FSD-слой *pages*. Назван `views`, потому что `src/pages` Next считает Pages Router и превращает каждый файл в маршрут |
| `widgets` | Крупные самостоятельные блоки страницы |
| `features` | Пользовательские сценарии |
| `entities` | Бизнес-сущности |
| `shared` | Код без бизнес-логики (ui, lib, api, config); слайсов нет, только сегменты |

Правила, которые проверяет `.dependency-cruiser.js` (нарушение = ошибка `lint:arch`):
- импорт из вышестоящего слоя запрещён;
- слайсы одного слоя (`features/a` → `features/b`) не импортируют друг друга — общее выносится ниже;
- снаружи слайс импортируется только через его `index.ts` (`@/entities/user`, не `@/entities/user/model/store`);
- запрещены циклы, неразрешимые импорты, пакеты вне `package.json` и devDependencies в коде приложения.

Файлы `src/app/**/page.tsx` и `layout.tsx` держи тонкими: страница собирается в `views` и реэкспортируется/рендерится из `app`.

`src/app/providers.tsx` — клиентский компонент с `QueryClientProvider` (`staleTime` 60 с); подключён в корневом `layout.tsx`.

## Конфигурация

- Единственный алиас — `@/*` → `src/*` (задаётся в `paths` в `tsconfig.json`, Vitest читает его через `resolve.tsconfigPaths`).
- Tailwind сканирует `src/**/*`. ESLint ужесточает `@next/next/no-img-element` до `error` — изображения только через `next/image`.
- `tsconfig` строгий: `noUnusedLocals`, `noUnusedParameters`, `noUncheckedSideEffectImports`.
- ESLint закреплён на 9.x: плагины внутри `eslint-config-next` пока не поддерживают ESLint 10.
- Vitest работает в `jsdom`, но `@testing-library/react` и `@vitejs/plugin-react` не установлены — для тестов компонентов их нужно добавить.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
