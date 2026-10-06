export type Tile = 'grass' | 'wheat' | 'tree'

export type Direction = 'up' | 'down' | 'left' | 'right'

/** Спрайт трактора смотрит вправо; влево — отражаем */
export type Facing = 'left' | 'right'

export type TractorState = 'default' | 'wreck' | 'winner'

export type GameStatus = 'playing' | 'lost' | 'won'

export interface Position {
  x: number
  y: number
}

export interface Field {
  cols: number
  rows: number
  /** Клетки построчно: индекс = y * cols + x */
  tiles: readonly Tile[]
  start: Position
}

export interface GameState {
  cols: number
  rows: number
  tiles: readonly Tile[]
  tractor: Position
  facing: Facing
  status: GameStatus
  harvested: number
  totalWheat: number
}
