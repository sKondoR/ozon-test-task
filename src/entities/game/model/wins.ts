import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'tractor-game:wins'
const CHANGE_EVENT = 'tractor-game:wins-change'

// localStorage может быть недоступен (приватный режим, запрет сайта) — тогда счёт просто не сохраняется
function readWins(): number {
  try {
    const value = Number(window.localStorage.getItem(STORAGE_KEY))
    return Number.isInteger(value) && value > 0 ? value : 0
  } catch {
    return 0
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

export function incrementWins(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(readWins() + 1))
    window.dispatchEvent(new Event(CHANGE_EVENT))
  } catch {}
}

/** Рекорд — общее число побед на этом устройстве */
export function useWins(): number {
  return useSyncExternalStore(subscribe, readWins, () => 0)
}
