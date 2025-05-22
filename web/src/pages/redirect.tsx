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
      const link = await fetchLink(shortUrl)
      if (!link) return
      await accessLink(link)
      // if (link?.originalUrl) {
      //   window.location.href = link.originalUrl
      // }
    }
    handleRedirect()
  }, [shortUrl, fetchLink, accessLink])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-lg p-10 w-full text-center">
        <img src={logo} alt="Brevly" className="center" />
        <p className="text-lg font-semibold mb-2">Redirecionando...</p>
        <p className="text-sm ">O link será aberto automaticamente em alguns instantes.</p>
      </div>
    </div>
  )
}