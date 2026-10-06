import { faTrophy, faWheatAwn } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import type { GameState } from '@/entities/game'

interface GameHudProps {
  game: GameState | null
  wins: number
}

export function GameHud({ game, wins }: GameHudProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 bg-hud px-4 text-white">
      <h1 className="text-lg font-bold tracking-tight">Трактор</h1>
      <div className="flex items-center gap-5 text-base font-semibold tabular-nums">
        <p aria-live="polite" aria-atomic="true" className="flex items-center gap-2">
          <FontAwesomeIcon icon={faWheatAwn} className="text-wheat" aria-hidden />
          <span className="sr-only">Собрано пшеницы:</span>
          {game?.harvested ?? '–'} / {game?.totalWheat ?? '–'}
        </p>
        <p className="flex items-center gap-2" title="Рекорд — число побед">
          <FontAwesomeIcon icon={faTrophy} className="text-wheat" aria-hidden />
          <span className="sr-only">Побед:</span>
          {wins}
        </p>
      </div>
    </header>
  )
}
