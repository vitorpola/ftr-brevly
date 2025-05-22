import { api } from '../lib/axios'

export async function accessLinkApi(shortUrl: string): Promise<boolean> {
  const response = await api.patch(`links/${shortUrl}`)
  return response.status !== 200
}
