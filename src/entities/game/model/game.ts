import { FIELD_DENSITY } from '../config'
import { generateField } from './generate-field'
import { isInside, toIndex } from './grid'
import type { Direction, Field, GameState, GameStatus, TractorState } from './types'

const STEP: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
}

export function createGame(field: Field): GameState {
  return {
    cols: field.cols,
    rows: field.rows,
    tiles: field.tiles,
    tractor: field.start,
    facing: 'right',
    status: 'playing',
    harvested: 0,
    totalWheat: field.tiles.filter((tile) => tile === 'wheat').length,
  }
}

/** Новая партия на случайном поле с плотностью деревьев и пшеницы из конфига */
export function newGame(cols: number, rows: number): GameState {
  return createGame(generateField({ cols, rows, ...FIELD_DENSITY }))
}

/**
 * Один шаг трактора. Край поля — стена (трактор стоит на месте),
 * дерево — авария, пшеница собирается и превращается в траву.
 */
export function moveTractor(state: GameState, direction: Direction): GameState {
  if (state.status !== 'playing') return state

  const facing = direction === 'left' || direction === 'right' ? direction : state.facing
  const { dx, dy } = STEP[direction]
  const target = { x: state.tractor.x + dx, y: state.tractor.y + dy }

  if (!isInside(target, state.cols, state.rows)) {
    return facing === state.facing ? state : { ...state, facing }
  }

  const index = toIndex(target, state.cols)
  const tile = state.tiles[index]

  // Врезавшись, трактор остаётся перед деревом: так видно и дерево, и обломки
  if (tile === 'tree') return { ...state, facing, status: 'lost' }

  if (tile === 'wheat') {
    const tiles = state.tiles.map((current, i) => (i === index ? 'grass' : current))
    const harvested = state.harvested + 1
    const status = harvested === state.totalWheat ? 'won' : 'playing'
    return { ...state, tiles, tractor: target, facing, harvested, status }
  }

  return { ...state, tractor: target, facing }
}

export function getTractorState(status: GameStatus): TractorState {
  if (status === 'lost') return 'wreck'
  if (status === 'won') return 'winner'
  return 'default'
}
