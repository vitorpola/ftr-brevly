import type { Link } from '../contexts/LinksContext'
import { api } from '../lib/axios'

export async function fetchLinksApi(): Promise<Link[]> {
  const response = await api.get('links')

  return response.data.links
}
