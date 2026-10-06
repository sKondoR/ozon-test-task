'use client'

import { useEffect, useRef } from 'react'

import { TractorSprite, type GameState } from '@/entities/game'
import { Button } from '@/shared/ui/Button'

interface GameResultDialogProps {
  game: GameState
  wins: number
  onRestart: () => void
}

/** Итог партии. Нативный модальный <dialog> сам держит фокус внутри и блокирует поле */
export function GameResultDialog({ game, wins, onRestart }: GameResultDialogProps) {
  const { status, harvested, totalWheat } = game
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
    return () => dialog?.close()
  }, [])

  const isWin = status === 'won'

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="game-result-title"
      // Esc не закрывает: из итога партии выход только через «Сыграть снова»
      onCancel={(event) => event.preventDefault()}
      className="m-auto w-[min(22rem,calc(100vw-2rem))] rounded-2xl bg-hud p-6 text-center text-white shadow-2xl backdrop:bg-black/55"
    >
      <TractorSprite status={status} className="mx-auto size-28" />
      <h2 id="game-result-title" className="mt-2 text-3xl font-extrabold">
        {isWin ? 'Победа!' : 'Game Over'}
      </h2>
      <p className="mt-2 text-white/80">
        {isWin ? 'Вся пшеница собрана.' : `Трактор врезался в дерево. Собрано ${harvested} из ${totalWheat}.`}
      </p>
      <p className="mt-1 text-white/80">Побед всего: {wins}</p>
      <Button autoFocus onClick={onRestart} className="mt-6 w-full py-3 text-lg">
        Сыграть снова
      </Button>
    </dialog>
  )
}
