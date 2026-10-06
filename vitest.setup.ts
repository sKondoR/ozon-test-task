// Матчеры jest-dom (toBeInTheDocument и т. п.) для expect из Vitest + их типы
import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// globals в Vitest выключены, поэтому автоочистка RTL не срабатывает — размонтируем вручную
afterEach(() => {
  cleanup()
})
