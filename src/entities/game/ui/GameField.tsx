import { TILE_SPRITES } from '../config'
import type { GameState, Tile } from '../model/types'
import { TractorSprite } from './TractorSprite'

// Стили клеток общие на всё поле: не создаём по объекту на каждую из сотен клеток
const TILE_STYLES = Object.fromEntries(
  Object.entries(TILE_SPRITES).map(([tile, url]) => [tile, { backgroundImage: `url(${url})` }]),
) as Record<Tile, { backgroundImage: string }>

interface GameFieldProps {
  game: GameState
  cellSize: number
}

export function GameField({ game, cellSize }: GameFieldProps) {
  const { cols, rows, tiles, tractor, facing, status } = game

  return (
    <div className="relative" style={{ width: cols * cellSize, height: rows * cellSize }}>
      <div className="grid size-full" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
        {tiles.map((tile, index) => (
          <div
            // Клетки не переставляются — индекс стабилен
            key={index}
            data-tile={tile}
            className="bg-cover"
            style={TILE_STYLES[tile]}
          />
        ))}
      </div>
      <div
        className="absolute top-0 left-0 transition-transform duration-100 ease-out motion-reduce:transition-none"
        style={{
          width: cellSize,
          height: cellSize,
          transform: `translate(${tractor.x * cellSize}px, ${tractor.y * cellSize}px)`,
        }}
      >
        <TractorSprite status={status} facing={facing} className="size-full" />
      </div>
    </div>
  )
}
