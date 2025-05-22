import { type ReactNode, useCallback, useEffect, useState } from 'react'
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

interface CreateLinkInput {
  originalUrl: string
  shortUrl: string
}

interface ToastError {
  message?: string
}

interface LinkContextType {
  links: Link[]
  toastError: ToastError
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
  const [toastError, setToastError] = useState<ToastError>({})

  const fetchLinks = useCallback(async () => {
    setLinks(await fetchLinksApi())
  }, [])

  const createLink = useCallback(
    async (data: CreateLinkInput) => {
      const { originalUrl, shortUrl } = data

      const id = await createLinkApi(originalUrl, shortUrl)

      if (!id) {
        setToastError({ message: 'Link already exists' })
        setTimeout(() => { setToastError({}) }, 3000)
        return false
      }
      const accessCount = 0
      const createdAt = new Date().toISOString()
      const newLink: Link = { id, originalUrl, shortUrl, accessCount, createdAt }

      setLinks((state) => [newLink, ...state])

      return true
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
        toastError,
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
