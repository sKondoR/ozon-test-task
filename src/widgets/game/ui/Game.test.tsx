import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { Game } from './Game'

// Поле S W T / . . W: вправо — пшеница, ещё раз вправо — дерево; вниз, вправо, вправо — победа
vi.mock('@/entities/game/model/generate-field', () => ({
  generateField: () => ({
    cols: 3,
    rows: 2,
    tiles: ['grass', 'wheat', 'tree', 'grass', 'grass', 'wheat'],
    start: { x: 0, y: 0 },
  }),
}))

let imagesLoad = true

beforeEach(() => {
  window.localStorage.clear()
  imagesLoad = true

  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(private callback: ResizeObserverCallback) {}
      observe() {
        this.callback([{ contentRect: { width: 192, height: 128 } } as ResizeObserverEntry], this as never)
      }
      disconnect() {}
    },
  )
  vi.stubGlobal(
    'Image',
    class {
      src = ''
      decode = () => (imagesLoad ? Promise.resolve() : Promise.reject(new Error('404')))
    },
  )
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }))
  // jsdom не реализует модальный <dialog>
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function () {
    this.open = false
  }
})

afterEach(() => vi.unstubAllGlobals())

function renderGame() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>
  return render(<Game />, { wrapper })
}

const counter = () => screen.getByText(/Собрано пшеницы/).parentElement

describe('Game', () => {
  test('сбор пшеницы увеличивает счётчик, дерево — Game Over, «Сыграть снова» начинает заново', async () => {
    const user = userEvent.setup()
    renderGame()
    await screen.findByRole('application')
    expect(counter()).toHaveTextContent('0 / 2')

    await user.keyboard('{ArrowRight}')
    expect(counter()).toHaveTextContent('1 / 2')

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('heading', { name: 'Game Over' })).toBeInTheDocument()

    await user.keyboard('{ArrowDown}') // после аварии трактор не двигается
    expect(counter()).toHaveTextContent('1 / 2')

    await user.click(screen.getByRole('button', { name: 'Сыграть снова' }))
    expect(screen.queryByRole('heading', { name: 'Game Over' })).not.toBeInTheDocument()
    expect(counter()).toHaveTextContent('0 / 2')
  })

  test('победа, когда собрана вся пшеница; число побед сохраняется', async () => {
    const user = userEvent.setup()
    renderGame()
    await screen.findByRole('application')

    await user.keyboard('{ArrowRight}{ArrowDown}{ArrowRight}')

    expect(screen.getByRole('heading', { name: 'Победа!' })).toBeInTheDocument()
    expect(screen.getByText('Побед всего: 1')).toBeInTheDocument()
    expect(window.localStorage.getItem('tractor-game:wins')).toBe('1')
  })

  test('если спрайты не загрузились — ошибка и повтор', async () => {
    imagesLoad = false
    const user = userEvent.setup()
    renderGame()
    expect(await screen.findByText('Не удалось загрузить изображения игры')).toBeInTheDocument()
    expect(screen.queryByRole('application')).not.toBeInTheDocument()

    imagesLoad = true
    await user.click(screen.getByRole('button', { name: 'Повторить' }))
    expect(await screen.findByRole('application')).toBeInTheDocument()
  })
})
