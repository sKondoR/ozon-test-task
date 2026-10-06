import { useEffect, useState } from 'react'

import { moveTractor, newGame } from './game'
import type { Direction, GameState } from './types'
import { incrementWins } from './wins'

/** Состояние партии. Пока размер поля неизвестен, партии нет (null) */
export function useGame() {
  const [game, setGame] = useState<GameState | null>(null)

  // Победа засчитывается один раз — при переходе партии в статус won
  const status = game?.status
  useEffect(() => {
    if (status === 'won') incrementWins()
  }, [status])

  return {
    game,
    /** Новая партия — всегда на свежем случайном поле */
    start: (cols: number, rows: number) => setGame(newGame(cols, rows)),
    /** Первая партия: создаётся, только если ещё не начата */
    ensureStarted: (cols: number, rows: number) => setGame((current) => current ?? newGame(cols, rows)),
    // Функциональное обновление: два шага до перерисовки (клавиша + автоповтор) не теряются
    move: (direction: Direction) => setGame((current) => current && moveTractor(current, direction)),
  }
}
