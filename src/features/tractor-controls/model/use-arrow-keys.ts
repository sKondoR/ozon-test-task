import { useEffect, useEffectEvent } from 'react'

import type { Direction } from '@/entities/game'

import { STEP_REPEAT_MS } from '../config'

const KEY_TO_DIRECTION: Partial<Record<string, Direction>> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

/**
 * Стрелки клавиатуры → шаг трактора. Отдельные нажатия проходят сразу,
 * а автоповтор при удержании прореживается до STEP_REPEAT_MS, чтобы скорость
 * не зависела от настроек ОС.
 */
export function useArrowKeys(onDirection: (direction: Direction) => void) {
  const handleDirection = useEffectEvent(onDirection)

  useEffect(() => {
    let lastStepAt = -Infinity

    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[event.key]
      if (!direction || event.altKey || event.ctrlKey || event.metaKey) return
      event.preventDefault() // иначе стрелки прокручивают страницу

      const now = performance.now()
      if (event.repeat && now - lastStepAt < STEP_REPEAT_MS) return
      lastStepAt = now
      handleDirection(direction)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
