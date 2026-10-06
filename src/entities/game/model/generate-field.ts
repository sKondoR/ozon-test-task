import { neighbours, toPosition } from './grid'
import type { Field, Tile } from './types'

interface GenerateFieldOptions {
  cols: number
  rows: number
  treeRatio: number
  wheatRatio: number
  /** Источник случайности; в тестах подменяется детерминированным */
  random?: () => number
}

const ATTEMPTS_PER_TREE_COUNT = 20

function shuffle<T>(items: T[], random: () => number): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

/** Сколько клеток без деревьев достижимо из start (обход в ширину по 4 направлениям) */
function countReachable(isTree: boolean[], start: number, cols: number, rows: number): number {
  const visited = new Uint8Array(isTree.length)
  const queue = [start]
  visited[start] = 1
  for (let head = 0; head < queue.length; head++) {
    for (const next of neighbours(queue[head], cols, rows)) {
      if (!visited[next] && !isTree[next]) {
        visited[next] = 1
        queue.push(next)
      }
    }
  }
  return queue.length
}

/**
 * Случайное поле, на котором трактор может доехать до каждой нетронутой клетки,
 * а значит — собрать всю пшеницу. Рядом со стартом деревьев нет, чтобы первый же ход
 * не заканчивался аварией. Если связное поле с заданной долей деревьев не получается,
 * деревьев становится меньше (при нуле поле связно всегда).
 */
export function generateField({ cols, rows, treeRatio, wheatRatio, random = Math.random }: GenerateFieldOptions): Field {
  const total = cols * rows
  const cells = Array.from({ length: total }, (_, i) => i)

  for (let treeCount = Math.round(total * treeRatio); treeCount >= 0; treeCount--) {
    for (let attempt = 0; attempt < ATTEMPTS_PER_TREE_COUNT; attempt++) {
      const start = Math.floor(random() * total)
      const safeZone = new Set([start, ...neighbours(start, cols, rows)])
      const candidates = shuffle(
        cells.filter((i) => !safeZone.has(i)),
        random,
      )
      if (candidates.length < treeCount) break

      const isTree = Array<boolean>(total).fill(false)
      for (const i of candidates.slice(0, treeCount)) isTree[i] = true

      if (countReachable(isTree, start, cols, rows) !== total - treeCount) continue

      const free = shuffle(
        cells.filter((i) => i !== start && !isTree[i]),
        random,
      )
      const wheatCount = Math.min(free.length, Math.max(1, Math.round(total * wheatRatio)))
      const isWheat = new Set(free.slice(0, wheatCount))

      const tiles: Tile[] = cells.map((i) => (isTree[i] ? 'tree' : isWheat.has(i) ? 'wheat' : 'grass'))
      return { cols, rows, tiles, start: toPosition(start, cols) }
    }
  }

  // Недостижимо: без деревьев поле всегда связно
  throw new Error(`Не удалось сгенерировать поле ${cols}×${rows}`)
}
