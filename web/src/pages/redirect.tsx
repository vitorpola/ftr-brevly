import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useContextSelector } from 'use-context-selector'
import logo from '../assets/logo.svg'
import { LinksContext } from '../contexts/LinksContext'

export function Redirect() {
  const { shortUrl } = useParams()
  const fetchLink = useContextSelector(LinksContext, ctx => ctx.fetchLink)
  const accessLink = useContextSelector(LinksContext, ctx => ctx.accessLink)

  useEffect(() => {
    async function handleRedirect() {
      if (!shortUrl) return
      try {
        const link = await fetchLink(shortUrl)
        if (!link) return
        await accessLink(link)
        if (link?.originalUrl) {
          window.location.href = link.originalUrl
        }
      } catch (error) {
        window.location.href = '/url/not-found'
      }
    }
    handleRedirect()
  }, [shortUrl, fetchLink, accessLink])

  return (
    <div className="flex items-center justify-center h-screen p-4">
      <div className="bg-white rounded-lg p-10 text-center lg:w-1/2 w-full">
        <img src={logo} alt="Brevly" className="inline" />
        <p className="text-lg font-semibold mb-2">Redirecionando...</p>
        <p className="text-sm ">O link será aberto automaticamente em alguns instantes.</p>
      </div>
    </div>
  )
}