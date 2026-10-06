import type { ComponentProps } from 'react'

/** Основная кнопка: жёлтая «пшеничная» на тёмном фоне */
export function Button({ className, type = 'button', ...props }: ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={`rounded-xl bg-wheat px-5 py-2.5 font-bold text-hud transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60 ${className ?? ''}`}
      {...props}
    />
  )
}
