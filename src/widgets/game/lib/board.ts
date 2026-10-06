import { BOARD_CONFIG } from '../config'

export interface Size {
  width: number
  height: number
}

/** Сколько клеток по 64px влезает в область поля */
export function getGridSize({ width, height }: Size): { cols: number; rows: number } {
  const { cellSize, minCols, minRows } = BOARD_CONFIG
  return {
    cols: Math.max(minCols, Math.floor(width / cellSize)),
    rows: Math.max(minRows, Math.floor(height / cellSize)),
  }
}

/**
 * Размер клетки при отрисовке. Обычно 64px; если область уменьшилась посреди
 * партии (ресайз окна), клетки сжимаются, а новое число клеток будет со следующей игры.
 */
export function getCellSize({ cols, rows }: { cols: number; rows: number }, { width, height }: Size): number {
  return Math.max(1, Math.floor(Math.min(BOARD_CONFIG.cellSize, width / cols, height / rows)))
}
