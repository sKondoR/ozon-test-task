# Трактор — сбор пшеницы

Игра в духе «змейки»: трактор ездит по полю, собирает пшеницу и не должен врезаться в дерево.

Демо: https://skondor.github.io/ozon-test-task/

## Правила

- Поле занимает весь экран, клетка — 64×64 px, число клеток зависит от размера экрана.
- Трактор делает шаг по нажатию стрелки (на тач-устройствах — крестовина внизу экрана). Удержание повторяет шаг.
- Пшеница собирается и увеличивает счётчик «собрано / всего». Край поля — стена.
- Врезался в дерево — Game Over. Собрал всю пшеницу — победа. Число побед (рекорд) хранится в `localStorage`.
- Поле генерируется случайно: 10% деревьев, 15% пшеницы. Генератор гарантирует, что вся пшеница достижима.

## Запуск

```bash
npm install
npm run dev     # http://localhost:4321
npm test        # Vitest
npm run build
```

## Стек и структура

Next.js 16 (App Router, static export на GitHub Pages), React 19 + React Compiler, TypeScript, Tailwind 4, TanStack Query (загрузка спрайтов). Архитектура — Feature-Sliced Design:

- `src/entities/game` — модель: генерация поля, ход трактора, счёт побед, отрисовка поля;
- `src/features/tractor-controls` — управление: стрелки клавиатуры и крестовина;
- `src/widgets/game` — сборка игры: HUD, поле, окно результата;
- `src/views/game`, `src/app` — страница и роутинг.

Подробности для разработки — в [CLAUDE.md](CLAUDE.md).

## Версия на чистом JS

[public/js/150.js](public/js/150.js) — та же игра одним файлом на ванильном JS в 150 строк.

- онлайн: https://skondor.github.io/ozon-test-task/js/index.html (файлы из `public/` попадают в статическую сборку как есть);
- локально: откройте [public/js/index.html](public/js/index.html) в браузере или `npm run dev` → http://localhost:4321/js/index.html.
