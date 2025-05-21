import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import { api } from '../lib/axios'

interface Link {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: string
}

interface CreateLinkInput {
  originalUrl: string
  shortUrl: string
}

interface LinkContextType {
  links: Link[]
  fetchLinks: (query?: string) => Promise<void>
  createLink: (data: CreateLinkInput) => Promise<void>
  deleteLink: (id: string) => Promise<void>
}

interface LinksProviderProps {
  children: ReactNode
}

export const LinksContext = createContext({} as LinkContextType)

export function LinksProvider({ children }: LinksProviderProps) {
  const [links, setLinks] = useState<Link[]>([])

  const fetchLinks = useCallback(async (query?: string) => {
    const response = await api.get('links', {
      params: {
        q: query,
      },
    })

    setLinks(response.data.links)
  }, [])

  const createLink = useCallback(
    async (data: CreateLinkInput) => {
      const { originalUrl, shortUrl } = data

      const response = await api.post('links', {
        originalUrl,
        shortUrl,
      })

      setLinks((state) => [response.data, ...state])
    },
    [],
  )

  const deleteLink = useCallback(async (shortUrl: string) => {
    await api.delete(`links/${shortUrl}`)

    setLinks((state) => state.filter((link) => link.shortUrl !== shortUrl))
  }, [])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  return (
    <LinksContext.Provider
      value={{
        links,
        fetchLinks,
        createLink,
        deleteLink,
      }}
    >
      {children}
    </LinksContext.Provider>
  )
}
