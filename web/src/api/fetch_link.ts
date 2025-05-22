import type { Link } from '../contexts/LinksContext'
import { api } from '../lib/axios'

export async function fetchLinkApi(shortUrl: string): Promise<Link | null> {
  const response = await api.get(`links/${shortUrl}`)
  if (response.status !== 200) {
    return null
  }

  return response.data.link
}
