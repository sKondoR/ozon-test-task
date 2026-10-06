import { TRACTOR_SPRITES } from '../config'
import { getTractorState } from '../model/game'
import type { Facing, GameStatus } from '../model/types'

interface TractorSpriteProps {
  status: GameStatus
  facing?: Facing
  className?: string
}

/** Трактор: целый, сломанный или победитель — по статусу партии. Спрайт смотрит вправо */
export function TractorSprite({ status, facing = 'right', className }: TractorSpriteProps) {
  return (
    <div
      aria-hidden
      className={`bg-cover ${className ?? ''}`}
      style={{
        backgroundImage: `url(${TRACTOR_SPRITES[getTractorState(status)]})`,
        transform: facing === 'left' ? 'scaleX(-1)' : undefined,
      }}
    />
  )
}
