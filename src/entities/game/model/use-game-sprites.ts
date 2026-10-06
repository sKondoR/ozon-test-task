import { preload } from 'react-dom'
import { useQuery } from '@tanstack/react-query'

import { preloadImages } from '@/shared/lib/preload-images'

import { ALL_SPRITES } from '../config'

/** Готовность спрайтов: игра стартует, только когда все они загружены и декодированы */
export function useGameSprites() {
  // <link rel="preload"> попадает в HTML, и спрайты качаются ещё до гидратации
  for (const url of ALL_SPRITES) preload(url, { as: 'image', fetchPriority: 'high' })

  return useQuery({
    queryKey: ['game-sprites'],
    queryFn: () => preloadImages(ALL_SPRITES).then(() => true),
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
