## Требования

### Функциональные:

- продукт: игра-змейка.
  поле - 20х10 клеток, настраиваемое. трактор - занимает 1 клетку. На поле есть объекты - деревья и пшеница - они тоже занимают 1 клетку. Пшеницу мы собираем. Приложение растягивается на 100% экрана.
- основные пользовательские сценарии:
  трактор ездит по полю - двигается только по нажатию стрелок на клавиатуре. Пшеницу собирает - увеличивается счетчик собранной пшеницы. Когда врезается в дерево - игра останавливается, появляется сообщение Game Over
  трактор победил когда на поле не осталось пшеницы
- платформа: веб и мобилка. на мобильном приложении внизу по центру rhue с зоной нажатия и 4мя стрелками

Спрайты поля:

- https://storage.yandexcloud.net/ozon-interview/tile-grass.png
- https://storage.yandexcloud.net/ozon-interview/tile-tree.png
- https://storage.yandexcloud.net/ozon-interview/tile-wheat.png

Трактор: https://storage.yandexcloud.net/ozon-interview/tractor.png
Сломанный трактор: https://storage.yandexcloud.net/ozon-interview/tractor-wreck.png
Трактор-победитель: https://storage.yandexcloud.net/ozon-interview/tractor-winner.png
Злой трактор: https://storage.yandexcloud.net/ozon-interview/evil-tractor.png

### Нефункциональные:

- ограничения системы, технические нюансы:
  DAU/MAU, RPS, read/write, размеры сущностей и прирост в день, geo

## Ключевые сценарии / основные компоненты

## Сущности и основные типы

type Tractor {
state: 'default' | 'winner' | 'wreck'
}

type GroundTile {
state: 'grass' | 'wheet' | 'tree'
}

## API

в данном mvp нет.

## High-level archtecture

## Стратегии рендеринга по компонентам

- CSR
- SSR
- SSG
- ISR

## Оптимизация

отпимистичные обновления
CDN, кэширование, сжатие gzip, минификация css/js, code splitting/lazy loading, сжатие изображений, формат изображений webp
уменьшать js, тяжелые вычисления в webworker

Спрайты поля:

- https://storage.yandexcloud.net/ozon-interview/tile-grass.png
- https://storage.yandexcloud.net/ozon-interview/tile-tree.png
- https://storage.yandexcloud.net/ozon-interview/tile-wheat.png

Трактор: https://storage.yandexcloud.net/ozon-interview/tractor.png
Сломанный трактор: https://storage.yandexcloud.net/ozon-interview/tractor-wreck.png
Трактор-победитель: https://storage.yandexcloud.net/ozon-interview/tractor-winner.png
Злой трактор: https://storage.yandexcloud.net/ozon-interview/evil-tractor.png

## Метрики

### Performance

- LCP ≤ 2.5с
- INP ≤ 200 мс
- CLS ≤ 0.1
- TTFB ≤ 800 мс
- FCP ≤ 1.8 с

### Технические метрики

- размер бандла
- время загрузки чанков
- длительность API запросов

### Надежность

- мониторинг
- логирование js (sentry)

### Продуктовые метрики

- просмотры
- события по пользовательским сценариям

## Безопасность / аутентификация

- xss, csp, cors, csrf
- acsess/refresh tokens, OAuth 2.0, ...

## Доступность (accessibility)

- семантика
- доступность с клавиатуры
- контрастность
- поддержка скрин ридеров
- адаптация под разные темы
