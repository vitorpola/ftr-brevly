import type { AxiosError } from 'axios'
import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createContext } from 'use-context-selector'
import { accessLinkApi } from '../api/access_link'
import { createLinkApi } from '../api/create_link'
import { fetchLinkApi } from '../api/fetch_link'
import { fetchLinksApi } from '../api/fetch_links'
import { api } from '../lib/axios'

export interface Link {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: string
}

export interface CreateLinkInput {
  originalUrl: string
  shortUrl: string
}

interface LinkContextType {
  links: Link[]
  fetchLinks: (query?: string) => Promise<void>
  fetchLink: (shortUrl: string) => Promise<Link | null>
  accessLink: (link: Link) => Promise<boolean>
  createLink: (data: CreateLinkInput) => Promise<boolean>
  deleteLink: (shortUrl: string) => Promise<void>
}

interface LinksProviderProps {
  children: ReactNode
}

export const LinksContext = createContext({} as LinkContextType)

export function LinksProvider({ children }: LinksProviderProps) {
  const [links, setLinks] = useState<Link[]>([])

  const fetchLinks = useCallback(async () => {
    setLinks(await fetchLinksApi())
  }, [])

  const createLink = useCallback(
    async (data: CreateLinkInput) => {
      try {
        const id = await createLinkApi(data)
        if (id !== null) {
          const newLink: Link = {
            id,
            originalUrl: data.originalUrl,
            shortUrl: data.shortUrl,
            accessCount: 0,
            createdAt: new Date().toISOString()
          }
          setLinks((state) => [newLink, ...state])
          toast.success('Link cadastrado')
          return true
        }
        return false
      } catch (error) {
        let description = null
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as AxiosError<{ message?: string }>
          description = axiosError.response?.data?.message || description
        }
        toast.error('Erro ao cadastrar', { description })
        return false
      }
    },
    [],
  )

  const deleteLink = useCallback(async (shortUrl: string) => {
    await api.delete(`links/${shortUrl}`)

    setLinks((state) => state.filter((link) => link.shortUrl !== shortUrl))
  }, [])

  const accessLink = useCallback(async (link: Link) => {
    const accessed = await accessLinkApi(link.shortUrl)
    if (!accessed)
      return false

    link.accessCount += 1
    setLinks((state) => state.map((l) => (l.id === link.id ? link : l)))
    return true
  }, []);

  const fetchLink = useCallback(
    async (shortUrl: string) => {
      return fetchLinkApi(shortUrl)
    },
    [],
  )

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  return (
    <LinksContext.Provider
      value={{
        links,
        fetchLinks,
        fetchLink,
        accessLink,
        createLink,
        deleteLink,
      }}
    >
      {children}
    </LinksContext.Provider>
  )
}
