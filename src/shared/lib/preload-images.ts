/** Загружает и декодирует картинки; отклоняется, если хоть одна недоступна */
export async function preloadImages(urls: readonly string[]): Promise<void> {
  await Promise.all(
    urls.map((url) => {
      const image = new Image()
      image.src = url
      return image.decode()
    }),
  )
}
