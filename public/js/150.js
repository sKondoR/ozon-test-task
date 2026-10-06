// Трактор: сбор пшеницы — игра из src/ на чистом JS. Подключение: <script src="150.js" defer></script> (см. index.html).
const HOST = 'https://storage.yandexcloud.net/ozon-interview/'
const SPRITES = ['grass', 'tree', 'wheat', 'default', 'wreck', 'winner'] // клетки и состояния трактора
const CFG = { cell: 64, min: 3, trees: 0.1, wheat: 0.15, repeatMs: 130, winsKey: 'tractor-game:wins' }
const DIRS = { up: [0, -1, 'Вверх'], down: [0, 1, 'Вниз'], left: [-1, 0, 'Влево'], right: [1, 0, 'Вправо'] }
const ICONS =
  'wheat 576 M79.7 234.6c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0L134.1 444.3 49.4 529c-9.4 9.4-24.5 9.4-33.9 0-9.4-9.4-9.4-24.6 0-33.9l84.7-84.7-30.5-30.5c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zm104-104c6.2-4.1 14.7-3.4 20.1 2.1l46.1 46.1 6.1 6.7c19.7 23.8 26.3 55 19.2 83.9 31.7-7.7 66.2 1 90.6 25.3l46.1 46.1c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1zM495.2 15c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.2L529.2 49 414.7 163.4c7.7 1 15.2 3 22.5 5.9L495.5 111c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-52.7 52.7 39 39c6.2 6.2 6.2 16.4 0 22.6l-7.4 7.4c-37.5 37.5-98.3 37.5-135.8 0l-94.9-94.9c-37.5-37.5-37.5-98.3 0-135.7l7.4-7.4 2.5-2.1c6.2-4.1 14.7-3.4 20.1 2.1l39 39 52.7-52.7c9.4-9.4 24.6-9.4 34 0 8.8 8.8 9.3 22.7 1.6 32.1l-1.7 1.8-58.3 58.3c2.8 7.1 4.7 14.5 5.7 22.1L495.2 15z|trophy 512 M144.3 0l224 0c26.5 0 48.1 21.8 47.1 48.2-.2 5.3-.4 10.6-.7 15.8l49.6 0c26.1 0 49.1 21.6 47.1 49.8-7.5 103.7-60.5 160.7-118 190.5-15.8 8.2-31.9 14.3-47.2 18.8-20.2 28.6-41.2 43.7-57.9 51.8l0 73.1 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0 0-73.1c-16-7.7-35.9-22-55.3-48.3-18.4-4.8-38.4-12.1-57.9-23.1-54.1-30.3-102.9-87.4-109.9-189.9-1.9-28.1 21-49.7 47.1-49.7l49.6 0c-.3-5.2-.5-10.4-.7-15.8-1-26.5 20.6-48.2 47.1-48.2zM101.5 112l-52.4 0c6.2 84.7 45.1 127.1 85.2 149.6-14.4-37.3-26.3-86-32.8-149.6zM380 256.8c40.5-23.8 77.1-66.1 83.3-144.8L411 112c-6.2 60.9-17.4 108.2-31 144.8z|up 448 M201.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 173.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z|down 448 M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z|left 320 M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z|right 320 M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z|phone 384 M16 64C16 28.7 44.7 0 80 0L304 0c35.3 0 64 28.7 64 64l0 384c0 35.3-28.7 64-64 64L80 512c-35.3 0-64-28.7-64-64L16 64zM128 440c0 13.3 10.7 24 24 24l80 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-80 0c-13.3 0-24 10.7-24 24zM304 64l-224 0 0 304 224 0 0-304z' // Font Awesome solid: «имя ширина путь»
const src = (name) => `${HOST}${SPRITES.indexOf(name) < 3 ? `tile-${name}` : name === 'default' ? 'tractor' : `tractor-${name}`}.png`
const bg = (name) => `url(${src(name)})`
const icon = (name, [, width, path] = ICONS.match(`(?:^|[|])${name} ([0-9]+) ([^|]+)`)) =>
  `<svg class="ico" viewBox="0 0 ${width} 512" aria-hidden="true"><path fill="currentColor" d="${path}"/></svg>`
const $ = (id) => document.getElementById(id)
const shuffle = (items) => items.sort(() => Math.random() - 0.5)
const neighbours = (i, cols, rows) =>
  [i % cols > 0 && i - 1, i % cols < cols - 1 && i + 1, i >= cols && i - cols, i < cols * (rows - 1) && i + cols].filter((n) => n !== false)
const storage = (fn) => {
  try {
    return fn(localStorage)
  } catch {}
}
const readWins = () => Math.max(0, Number(storage((s) => s.getItem(CFG.winsKey))) || 0) // без localStorage победы не копятся
document.body.innerHTML = `<style>
:root{--field:#34501f;--hud:#1d2914;--wheat:#f0c75e;font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.5}*{box-sizing:border-box;margin:0}html,body{height:100%;overflow:hidden;overscroll-behavior:none;background:var(--field);-webkit-tap-highlight-color:transparent}.ico{height:1em;overflow:visible}
.app{display:flex;flex-direction:column;height:100dvh;overflow:hidden}.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}.hud{display:flex;height:3.5rem;flex-shrink:0;align-items:center;justify-content:space-between;gap:1rem;padding:0 1rem;background:var(--hud);color:#fff}
.hud h1{font-size:1.125rem;font-weight:700;letter-spacing:-.025em}.stats{display:flex;align-items:center;gap:1.25rem;font-weight:600;font-variant-numeric:tabular-nums}.stats p{display:flex;align-items:center;gap:.5rem}.stats .ico{color:var(--wheat)}
.board{position:relative;display:grid;flex:1;min-height:0;place-items:center;overflow:hidden}.msg{color:#fffc}.error{display:flex;max-width:24rem;flex-direction:column;align-items:center;gap:1rem;padding:1.5rem;text-align:center;color:#fff}.error b{font-size:1.125rem;font-weight:600}.error span{color:#ffffffbf}
.btn:hover{filter:brightness(1.1)}.btn:focus-visible{outline:2px solid #fff;outline-offset:2px}.btn{border:0;border-radius:.75rem;background:var(--wheat);color:var(--hud);padding:.625rem 1.25rem;font:inherit;font-weight:700;cursor:pointer;transition:filter .15s}.btn:disabled{opacity:.6}.field{position:relative}
.tiles{display:grid;width:100%;height:100%}.tiles div,.sprite{background-size:cover}.sprite{width:100%;height:100%}.tractor{position:absolute;top:0;left:0;transition:transform .1s cubic-bezier(0,0,.2,1)}@media (prefers-reduced-motion:reduce){.tractor{transition:none}}
.dpad{display:none;position:absolute;bottom:max(1.5rem,env(safe-area-inset-bottom));left:50%;width:10rem;height:10rem;translate:-50% 0;border-radius:50%;background:#00000040;backdrop-filter:blur(2px);touch-action:none;user-select:none;-webkit-user-select:none}.dpad button:active{background:#ffffff40}
.dpad button{position:absolute;display:grid;width:3.5rem;height:3.5rem;place-items:center;border:0;border-radius:50%;background:none;color:#ffffffe6;font-size:1.5rem}.up,.down{left:50%;translate:-50% 0}.left,.right{top:50%;translate:0 -50%}.up{top:0}.down{bottom:0}.left{left:0}.right{right:0}
.rotate{display:none;position:fixed;inset:0;z-index:50;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:1.5rem;background:var(--hud);color:#fff;text-align:center;font-size:1.125rem;font-weight:600}.rotate .ico{font-size:3rem;color:var(--wheat)}@media (pointer:coarse){.ready .dpad{display:block}}
@media (pointer:coarse) and (orientation:landscape){.rotate{display:flex}.dpad{visibility:hidden}}dialog{margin:auto;width:min(22rem,calc(100vw - 2rem));border:0;border-radius:1rem;padding:1.5rem;background:var(--hud);color:#fff;text-align:center;box-shadow:0 25px 50px -12px #00000040}dialog::backdrop{background:#0000008c}
dialog .sprite{width:7rem;height:7rem;margin:0 auto}dialog h2{margin-top:.5rem;font-size:1.875rem;line-height:1.2;font-weight:800}dialog p{margin-top:.5rem;color:#fffc}dialog p+p{margin-top:.25rem}dialog .btn{width:100%;margin-top:1.5rem;padding:.75rem 1rem;font-size:1.125rem}
</style><main class="app" id="app"><header class="hud"><h1>Трактор</h1><div class="stats">
  <p aria-live="polite" aria-atomic="true">${icon('wheat')}<span class="sr">Собрано пшеницы:</span><span id="score">– / –</span></p>
  <p title="Рекорд — число побед">${icon('trophy')}<span class="sr">Побед:</span><span id="wins">0</span></p></div></header>
<div class="board" id="board"><div id="msg"></div>
  <div class="field" id="field" role="application" aria-label="Игровое поле. Управляйте трактором стрелками" aria-roledescription="игра" hidden>
  <div class="tiles" id="tiles"></div><div class="tractor" id="tractor"><div class="sprite" id="sprite"></div></div></div>
  <div class="dpad">${Object.keys(DIRS)
    .map((d) => `<button type="button" class="${d}" data-dir="${d}" aria-label="${DIRS[d][2]}">${icon(d)}</button>`)
    .join('')}</div></div>
<dialog id="result" aria-labelledby="result-title"></dialog><div class="rotate" role="alert">${icon('phone')}<p>Поверните устройство вертикально</p></div></main>`
let [game, size, ready, tileEls, lastStepAt] = [null, null, false, [], -Infinity] // game: { cols, rows, tiles, pos, facing, status, harvested, total }
function generate(cols, rows) {
  // Случайное поле, где трактор доезжает до любой клетки без дерева; рядом со стартом деревьев нет
  const [total, cells] = [cols * rows, [...Array(cols * rows).keys()]]
  for (let trees = Math.round(total * CFG.trees); trees >= 0; trees--) {
    for (let attempt = 0; attempt < 20; attempt++) {
      const start = Math.floor(Math.random() * total)
      const safe = new Set([start, ...neighbours(start, cols, rows)])
      const isTree = new Set(shuffle(cells.filter((i) => !safe.has(i))).slice(0, trees))
      if (isTree.size < trees) break
      const seen = new Set([start])
      for (const i of seen) for (const n of neighbours(i, cols, rows)) if (!isTree.has(n)) seen.add(n)
      if (seen.size !== total - trees) continue
      const free = shuffle(cells.filter((i) => i !== start && !isTree.has(i)))
      const wheat = new Set(free.slice(0, Math.min(free.length, Math.max(1, Math.round(total * CFG.wheat)))))
      const tiles = cells.map((i) => (isTree.has(i) ? 'tree' : wheat.has(i) ? 'wheat' : 'grass'))
      return { cols, rows, tiles, pos: start, facing: 'right', status: 'playing', harvested: 0, total: wheat.size }
    }
  }
}
function start() {
  game = generate(Math.max(CFG.min, Math.floor(size.w / CFG.cell)), Math.max(CFG.min, Math.floor(size.h / CFG.cell)))
  Object.assign($('tiles').style, { gridTemplateColumns: `repeat(${game.cols},1fr)`, gridTemplateRows: `repeat(${game.rows},1fr)` })
  tileEls = game.tiles.map((tile) => Object.assign(document.createElement('div'), { style: `background-image:${bg(tile)}` }))
  $('tiles').replaceChildren(...tileEls)
  $('result').close()
  render()
}
function render() {
  $('score').textContent = game ? `${game.harvested} / ${game.total}` : '– / –'
  $('wins').textContent = readWins()
  if (!game || !ready) return
  const cell = Math.max(1, Math.floor(Math.min(CFG.cell, size.w / game.cols, size.h / game.rows)))
  const [x, y, px] = [game.pos % game.cols, Math.floor(game.pos / game.cols), `${cell}px`]
  Object.assign($('field').style, { width: `${game.cols * cell}px`, height: `${game.rows * cell}px` })
  Object.assign($('tractor').style, { width: px, height: px, transform: `translate(${x * cell}px, ${y * cell}px)` })
  const state = { lost: 'wreck', won: 'winner', playing: 'default' }[game.status]
  Object.assign($('sprite').style, { backgroundImage: bg(state), transform: game.facing === 'left' ? 'scaleX(-1)' : '' })
  if (game.status === 'playing' || $('result').open) return
  $('result').innerHTML = `<div class="sprite" aria-hidden="true" style="background-image:${bg(state)}"></div>
    <h2 id="result-title">${state === 'winner' ? 'Победа!' : 'Game Over'}</h2>
    <p>${state === 'winner' ? 'Вся пшеница собрана.' : `Трактор врезался в дерево. Собрано ${game.harvested} из ${game.total}.`}</p>
    <p>Побед всего: ${readWins()}</p><button type="button" class="btn" autofocus>Сыграть снова</button>`
  $('result').querySelector('button').onclick = start
  $('result').showModal()
}
function move(dir) {
  // Шаг трактора: край поля — стена, дерево — авария, пшеница собирается
  if (!ready || game?.status !== 'playing' || matchMedia('(pointer: coarse) and (orientation: landscape)').matches) return
  if (DIRS[dir][0]) game.facing = dir // спрайт смотрит вправо, влево — отражаем
  const [x, y] = [(game.pos % game.cols) + DIRS[dir][0], Math.floor(game.pos / game.cols) + DIRS[dir][1]]
  const i = y * game.cols + x
  if (x < 0 || y < 0 || x >= game.cols || y >= game.rows) return render()
  if (game.tiles[i] === 'tree') game.status = 'lost'
  else game.pos = i
  if (game.tiles[i] === 'wheat') {
    game.tiles[i] = 'grass'
    tileEls[i].style.backgroundImage = bg('grass')
    if (++game.harvested === game.total) {
      game.status = 'won'
      storage((s) => s.setItem(CFG.winsKey, String(readWins() + 1)))
    }
  }
  render()
}
async function load(retries = 1, button = null) {
  // Спрайты грузятся до старта; при ошибке — один повтор, затем сообщение с кнопкой
  if (button) Object.assign(button, { disabled: true, textContent: 'Загружаем…' })
  else $('msg').innerHTML = '<p class="msg">Загружаем поле…</p>'
  try {
    await Promise.all(SPRITES.map((name) => Object.assign(new Image(), { src: src(name) }).decode()))
    ready = $('msg').hidden = true // поле показываем только с загруженными спрайтами
    $('field').hidden = false
    $('app').classList.add('ready')
    render()
  } catch {
    if (retries > 0) return setTimeout(() => load(retries - 1, button), 1000)
    $('msg').innerHTML = `<div class="error" role="alert"><b>Не удалось загрузить изображения игры</b>
      <span>Проверьте подключение к интернету и попробуйте ещё раз.</span><button type="button" class="btn">Повторить</button></div>`
    $('msg').querySelector('button').onclick = (e) => load(1, e.target)
  }
}
window.addEventListener('keydown', (e) => {
  const dir = e.key.startsWith('Arrow') && e.key.slice(5).toLowerCase()
  if (!DIRS[dir] || e.altKey || e.ctrlKey || e.metaKey) return
  e.preventDefault() // иначе стрелки прокручивают страницу; автоповтор прореживаем до repeatMs
  if (e.repeat && performance.now() - lastStepAt < CFG.repeatMs) return
  lastStepAt = performance.now()
  move(dir)
})
for (const button of document.querySelectorAll('.dpad button')) {
  button.onpointerup = button.onpointercancel = button.onlostpointercapture = () => clearInterval(button.timer)
  button.onpointerdown = (e) => {
    button.setPointerCapture(e.pointerId) // палец может съехать с кнопки — повтор идёт до отпускания
    move(button.dataset.dir)
    button.timer = setInterval(() => move(button.dataset.dir), CFG.repeatMs)
  }
  button.onclick = (e) => e.detail === 0 && move(button.dataset.dir) // клавиатура и скринридеры
  button.oncontextmenu = (e) => e.preventDefault()
}
$('result').oncancel = (e) => e.preventDefault() // из итога партии — только «Сыграть снова»
window.addEventListener('storage', render)
new ResizeObserver(([entry]) => {
  size = { w: Math.floor(entry.contentRect.width), h: Math.floor(entry.contentRect.height) }
  return game ? render() : start()
}).observe($('board'))
load()
