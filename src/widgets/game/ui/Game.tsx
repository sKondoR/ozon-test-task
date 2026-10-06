'use client'

import { useEffect, useState } from 'react'

import { DPad, useArrowKeys } from '@/features/tractor-controls'
import { GameField, useGame, useGameSprites, useWins, type Direction } from '@/entities/game'
import { useMediaQuery } from '@/shared/lib/use-media-query'
import { Button } from '@/shared/ui/Button'

import { getCellSize, getGridSize, type Size } from '../lib/board'
import { GameHud } from './GameHud'
import { GameResultDialog } from './GameResultDialog'
import { RotateDeviceNotice } from './RotateDeviceNotice'

export function Game() {
  const sprites = useGameSprites()
  const { game, start, ensureStarted, move } = useGame()
  const wins = useWins()
  const isTouch = useMediaQuery('(pointer: coarse)')
  const isTouchLandscape = useMediaQuery('(pointer: coarse) and (orientation: landscape)')

  // Размер поля в клетках зависит от свободного места, поэтому первая партия создаётся после замера
  const [board, setBoard] = useState<HTMLDivElement | null>(null)
  const [boardSize, setBoardSize] = useState<Size | null>(null)
  useEffect(() => {
    if (!board) return
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.floor(entry.contentRect.width)
      const height = Math.floor(entry.contentRect.height)
      // Тот же размер — тот же объект: React пропустит лишний рендер
      setBoardSize((current) => (current?.width === width && current.height === height ? current : { width, height }))
      const { cols, rows } = getGridSize({ width, height })
      ensureStarted(cols, rows)
    })
    observer.observe(board)
    return () => observer.disconnect()
  }, [board, ensureStarted])

  const isPlayable = sprites.isSuccess && !isTouchLandscape

  const handleDirection = (direction: Direction) => {
    if (isPlayable) move(direction)
  }

  useArrowKeys(handleDirection)

  const restart = () => {
    if (!boardSize) return
    const { cols, rows } = getGridSize(boardSize)
    start(cols, rows)
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-field">
      <GameHud game={game} wins={wins} />

      <div ref={setBoard} className="relative grid min-h-0 flex-1 place-items-center overflow-hidden">
        {sprites.isPending && <p className="text-white/80">Загружаем поле…</p>}

        {sprites.isError && (
          <div role="alert" className="flex max-w-sm flex-col items-center gap-4 p-6 text-center text-white">
            <p className="text-lg font-semibold">Не удалось загрузить изображения игры</p>
            <p className="text-white/75">Проверьте подключение к интернету и попробуйте ещё раз.</p>
            <Button onClick={() => sprites.refetch()} disabled={sprites.isFetching}>
              {sprites.isFetching ? 'Загружаем…' : 'Повторить'}
            </Button>
          </div>
        )}

        {sprites.isSuccess && game && boardSize && (
          <div role="application" aria-label="Игровое поле. Управляйте трактором стрелками" aria-roledescription="игра">
            <GameField game={game} cellSize={getCellSize(game, boardSize)} />
          </div>
        )}

        {isTouch && isPlayable && (
          <DPad
            onDirection={handleDirection}
            className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2"
          />
        )}
      </div>

      {game && game.status !== 'playing' && <GameResultDialog game={game} wins={wins} onRestart={restart} />}

      {isTouchLandscape && <RotateDeviceNotice />}
    </div>
  )
}
