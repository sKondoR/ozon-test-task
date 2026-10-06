import { describe, expect, test } from 'vitest'

import { generateField } from './generate-field'
import { neighbours, toIndex } from './grid'
import type { Field } from './types'

/** Детерминированный ГПСЧ (mulberry32), чтобы прогоны были воспроизводимыми */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function reachableCount({ cols, rows, tiles, start }: Field): number {
  const seen = new Set([toIndex(start, cols)])
  for (const i of seen) {
    for (const n of neighbours(i, cols, rows)) if (tiles[n] !== 'tree') seen.add(n)
  }
  return seen.size
}

const count = (field: Field, tile: string) => field.tiles.filter((t) => t === tile).length

describe('generateField', () => {
  test('создаёт поле заданного размера с нужной долей деревьев и пшеницы', () => {
    const field = generateField({ cols: 20, rows: 10, treeRatio: 0.1, wheatRatio: 0.15, random: seeded(1) })

    expect(field.tiles).toHaveLength(200)
    expect(count(field, 'tree')).toBe(20)
    expect(count(field, 'wheat')).toBe(30)
  })

  test('старт — трава, соседние клетки без деревьев', () => {
    for (let seed = 0; seed < 50; seed++) {
      const field = generateField({ cols: 8, rows: 6, treeRatio: 0.3, wheatRatio: 0.2, random: seeded(seed) })
      const start = toIndex(field.start, field.cols)

      expect(field.tiles[start]).toBe('grass')
      for (const n of neighbours(start, field.cols, field.rows)) expect(field.tiles[n]).not.toBe('tree')
    }
  })

  test('все клетки без деревьев достижимы со старта — вся пшеница собираема', () => {
    for (let seed = 0; seed < 100; seed++) {
      const field = generateField({ cols: 12, rows: 9, treeRatio: 0.35, wheatRatio: 0.15, random: seeded(seed) })

      expect(reachableCount(field)).toBe(field.tiles.length - count(field, 'tree'))
    }
  })

  test('на маленьком поле есть хотя бы одна пшеница', () => {
    const field = generateField({ cols: 3, rows: 3, treeRatio: 0.1, wheatRatio: 0.01, random: seeded(7) })

    expect(count(field, 'wheat')).toBe(1)
  })

  test('если связное поле с такой долей деревьев невозможно, деревьев становится меньше', () => {
    const field = generateField({ cols: 5, rows: 5, treeRatio: 0.9, wheatRatio: 0.1, random: seeded(3) })

    expect(count(field, 'tree')).toBeLessThan(Math.round(25 * 0.9))
    expect(reachableCount(field)).toBe(25 - count(field, 'tree'))
  })
})
