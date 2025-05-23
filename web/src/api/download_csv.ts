import { api } from '../lib/axios'

export async function downloadCSV(): Promise<URL | null> {
  const response = await api.post('links/export')
  if (response.status !== 200) {
    return null
  }

  return response.data.reportUrl
}
