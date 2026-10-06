import type { Position } from './types'

// Клетки хранятся построчно: индекс = y * cols + x

export const toIndex = ({ x, y }: Position, cols: number): number => y * cols + x

export const toPosition = (index: number, cols: number): Position => ({ x: index % cols, y: Math.floor(index / cols) })

export const isInside = ({ x, y }: Position, cols: number, rows: number): boolean => x >= 0 && y >= 0 && x < cols && y < rows

/** Соседи по четырём направлениям — так ездит трактор */
export function neighbours(index: number, cols: number, rows: number): number[] {
  const { x, y } = toPosition(index, cols)
  return [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ]
    .filter((position) => isInside(position, cols, rows))
    .map((position) => toIndex(position, cols))
}
