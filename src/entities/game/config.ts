const SPRITE_HOST = 'https://storage.yandexcloud.net/ozon-interview'

/** Доли деревьев и пшеницы от числа клеток (пшеницы — минимум одна) */
export const FIELD_DENSITY = {
  treeRatio: 0.1,
  wheatRatio: 0.15,
} as const

export const TILE_SPRITES = {
  grass: `${SPRITE_HOST}/tile-grass.png`,
  tree: `${SPRITE_HOST}/tile-tree.png`,
  wheat: `${SPRITE_HOST}/tile-wheat.png`,
} as const

export const TRACTOR_SPRITES = {
  default: `${SPRITE_HOST}/tractor.png`,
  wreck: `${SPRITE_HOST}/tractor-wreck.png`,
  winner: `${SPRITE_HOST}/tractor-winner.png`,
} as const

export const ALL_SPRITES = [...Object.values(TILE_SPRITES), ...Object.values(TRACTOR_SPRITES)]
