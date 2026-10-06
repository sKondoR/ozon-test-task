import { describe, expect, test } from 'vitest'

import { createGame, getTractorState, moveTractor } from './game'
import type { Field, Tile } from './types'

// Поле задаётся картинкой: . — трава, W — пшеница, T — дерево, S — старт трактора
function fieldFrom(rows: string[]): Field {
  const tiles: Tile[] = []
  let start = { x: 0, y: 0 }
  rows.forEach((row, y) =>
    [...row].forEach((char, x) => {
      if (char === 'S') start = { x, y }
      tiles.push(char === 'W' ? 'wheat' : char === 'T' ? 'tree' : 'grass')
    }),
  )
  return { cols: rows[0].length, rows: rows.length, tiles, start }
}

describe('moveTractor', () => {
  test('трактор едет на одну клетку по стрелке', () => {
    const game = createGame(fieldFrom(['...', '.S.', '...']))

    expect(moveTractor(game, 'up').tractor).toEqual({ x: 1, y: 0 })
    expect(moveTractor(game, 'down').tractor).toEqual({ x: 1, y: 2 })
    expect(moveTractor(game, 'left').tractor).toEqual({ x: 0, y: 1 })
    expect(moveTractor(game, 'right').tractor).toEqual({ x: 2, y: 1 })
  })

  test('край поля — стена: трактор стоит, но разворачивается', () => {
    const game = createGame(fieldFrom(['S..W']))

    const left = moveTractor(game, 'left')
    expect(left.tractor).toEqual({ x: 0, y: 0 })
    expect(left.facing).toBe('left')
    expect(moveTractor(game, 'up')).toBe(game)
  })

  test('вверх и вниз не меняют сторону, в которую смотрит трактор', () => {
    const game = moveTractor(createGame(fieldFrom(['W..', '..S', '...'])), 'left')

    expect(moveTractor(game, 'up').facing).toBe('left')
  })

  test('пшеница собирается, клетка становится травой', () => {
    const game = createGame(fieldFrom(['SWW']))

    const next = moveTractor(game, 'right')
    expect(next.harvested).toBe(1)
    expect(next.tiles[1]).toBe('grass')
    expect(next.status).toBe('playing')
    expect(game.tiles[1]).toBe('wheat') // исходное состояние не мутируется
  })

  test('вся пшеница собрана — победа', () => {
    const game = moveTractor(moveTractor(createGame(fieldFrom(['SWW'])), 'right'), 'right')

    expect(game.status).toBe('won')
    expect(game.harvested).toBe(game.totalWheat)
    expect(getTractorState(game.status)).toBe('winner')
  })

  test('дерево — Game Over, трактор остаётся перед деревом', () => {
    const game = moveTractor(createGame(fieldFrom(['STW'])), 'right')

    expect(game.status).toBe('lost')
    expect(game.tractor).toEqual({ x: 0, y: 0 })
    expect(getTractorState(game.status)).toBe('wreck')
  })

  test('после конца игры ходы игнорируются', () => {
    const lost = moveTractor(createGame(fieldFrom(['STW', '...'])), 'right')

    expect(moveTractor(lost, 'down')).toBe(lost)
  })
})
