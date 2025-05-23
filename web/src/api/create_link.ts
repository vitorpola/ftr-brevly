import type { CreateLinkInput } from '../contexts/LinksContext'
import { api } from '../lib/axios'

export async function createLinkApi(
  data: CreateLinkInput
): Promise<string | null> {
  const body = {
    shortUrl: data.shortUrl,
    originalUrl: data.originalUrl,
  }
  const response = await api.post('links', body)

  if (response.status !== 201) {
    return null
  }

  return response.data.id
}
