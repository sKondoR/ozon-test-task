import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'

import { Providers } from './providers'

import './globals.css'

export const metadata: Metadata = {
  title: 'Трактор — сбор пшеницы',
  description: 'Соберите всю пшеницу на поле и не врежьтесь в дерево',
}

export const viewport: Viewport = {
  themeColor: '#1d2914', // = --color-hud из globals.css
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
