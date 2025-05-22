import { api } from '../lib/axios'

export async function createLinkApi(
  shortUrl: string,
  originalUrl: string
): Promise<string | null> {
  const response = await api.post('links', { shortUrl, originalUrl })
  if (response.status !== 200) {
    return null
  }

  return response.data.link.id
}
