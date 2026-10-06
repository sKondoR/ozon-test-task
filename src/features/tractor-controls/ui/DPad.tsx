'use client'

import { useEffect, useEffectEvent, useState, type PointerEvent } from 'react'
import { faChevronDown, faChevronLeft, faChevronRight, faChevronUp, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import type { Direction } from '@/entities/game'

import { STEP_REPEAT_MS } from '../config'

const BUTTONS: { direction: Direction; label: string; icon: IconDefinition; position: string }[] = [
  { direction: 'up', label: 'Вверх', icon: faChevronUp, position: 'top-0 left-1/2 -translate-x-1/2' },
  { direction: 'down', label: 'Вниз', icon: faChevronDown, position: 'bottom-0 left-1/2 -translate-x-1/2' },
  { direction: 'left', label: 'Влево', icon: faChevronLeft, position: 'top-1/2 left-0 -translate-y-1/2' },
  { direction: 'right', label: 'Вправо', icon: faChevronRight, position: 'top-1/2 right-0 -translate-y-1/2' },
]

interface DPadProps {
  onDirection: (direction: Direction) => void
  className?: string
}

/** Крестовина для тач-экранов: шаг по нажатию, повтор — пока кнопка зажата */
export function DPad({ onDirection, className }: DPadProps) {
  const [pressed, setPressed] = useState<Direction | null>(null)
  const step = useEffectEvent(onDirection)

  useEffect(() => {
    if (!pressed) return
    step(pressed)
    const timer = window.setInterval(() => step(pressed), STEP_REPEAT_MS)
    return () => window.clearInterval(timer)
  }, [pressed])

  const handlePointerDown = (direction: Direction) => (event: PointerEvent<HTMLButtonElement>) => {
    // Захват указателя: палец может съехать с кнопки, повтор остановится только при отпускании
    event.currentTarget.setPointerCapture(event.pointerId)
    setPressed(direction)
  }
  const release = () => setPressed(null)

  return (
    <div className={`relative size-40 touch-none rounded-full bg-black/25 backdrop-blur-[2px] select-none ${className ?? ''}`}>
      {BUTTONS.map(({ direction, label, icon, position }) => (
        <button
          key={direction}
          type="button"
          aria-label={label}
          className={`absolute grid size-14 place-items-center rounded-full text-2xl text-white/90 active:bg-white/25 ${position}`}
          onPointerDown={handlePointerDown(direction)}
          onPointerUp={release}
          onPointerCancel={release}
          onLostPointerCapture={release}
          // Клавиатура и скринридеры жмут кнопку без pointer-событий
          onClick={(event) => {
            if (event.detail === 0) onDirection(direction)
          }}
          onContextMenu={(event) => event.preventDefault()}
        >
          <FontAwesomeIcon icon={icon} />
        </button>
      ))}
    </div>
  )
}
