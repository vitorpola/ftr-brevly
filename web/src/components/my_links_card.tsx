import { Copy, DownloadSimple, Link, SpinnerGap, Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useContextSelector } from "use-context-selector";
import { downloadCSV } from "../api/download_csv";
import { LinksContext } from "../contexts/LinksContext";
import { env } from "../env";

export function MyLinksCard() {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const deleteLink = useContextSelector(LinksContext, ctx => ctx.deleteLink)
  const fetchLinks = useContextSelector(LinksContext, ctx => ctx.fetchLinks)
  const links = useContextSelector(LinksContext, (ctx) => ctx.links)

  const handleDeleteLink = async (shortUrl: string) => {
    const confirmDelete = window.confirm(`Você realmente quer apagar o link ${shortUrl}?`)
    if (confirmDelete) {
      await deleteLink(shortUrl)
    }
  }

  const handleCopyLink = (shortUrl: string) => {
    navigator.clipboard.writeText(`${env.VITE_FRONTEND_URL}/${shortUrl}`)
    toast.info('Link copiado com sucesso!', {
      description: `O link ${shortUrl} foi copiado para a área de transferência.`,
    })
  }

  const handleDownloadCSV = async () => {
    setDownloading(true)
    try {
      const reportUrl = await downloadCSV()
      if (reportUrl) {
        const url = reportUrl.toString()
        const a = document.createElement('a')
        a.href = url
        a.download = `links-${new Date().toISOString()}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        toast.error('Erro ao baixar o CSV')
      }
    } catch (error) {
      toast.error('Erro ao baixar o CSV')
    } finally {
      setDownloading(false)
    }
  }


  useEffect(() => {
    async function loadLinks() {
      setLoading(true)
      await fetchLinks()
      setLoading(false)
    }
    loadLinks()

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        loadLinks()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchLinks])

  return (
    <div className="bg-gray-100 rounded-lg p-6 lg:p-8 w-full relative overflow-hidden">
      {loading && (<div className="absolute top-0 left-0 w-full h-1 " >
        <div className="h-full w-full bg-blue-base animate-slide" />
      </div>
      )}
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
        <h2 className="text-lg font-bold text-gray-600">Meus links</h2>

        <button
          type="button"
          disabled={(!loading && links.length === 0) || downloading}
          onClick={handleDownloadCSV}
          title="Baixar CSV"
          className="flex items-center gap-2 text-sm font-semibold p-2 bg-gray-200 hover:outline-2 hover:outline-blue-base rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:outline-none"
        >
          {downloading && (<SpinnerGap size={16} className="animate-spin" />)}
          {!downloading && (<DownloadSimple size={16} />)}
          Baixar CSV
        </button>
      </div>
      <div className="overflow-y-scroll scroll-smooth max-h-[calc(100vh-200px)]">
        {loading && (
          <div className="text-center text-gray-500 pt-4 pb-6">
            <SpinnerGap size={32} className="text-gray-400 inline mb-3 animate-spin" />
            <p className="text-xs text-gray-500">CARREGANDO LINKS...</p>
          </div>
        )}
        {!loading && links.length === 0 && (
          <div className="text-center text-gray-500 pt-4 pb-6">
            <Link size={32} className="text-gray-400 inline mb-3" />
            <p className="text-xs text-gray-500">AINDA NÃO EXISTEM LINKS CADASTRADOS</p>
          </div>
        )}

        {!loading && links.map((link) => (
          <div key={link.shortUrl} className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4 last:mb-0 last:border-none">
            <div className="flex-auto">
              <a
                href={link.shortUrl}
                className="text-md font-semibold text-blue-base hover:underline block truncate w-45 lg:w-65"
                target="_blank"
                rel="noopener noreferrer"
              >
                {env.VITE_FRONTEND_URL}/{link.shortUrl}
              </a>
              <p className="text-sm text-gray-500 truncate w-45 lg:w-65">{link.originalUrl}</p>
            </div>
            <div className="bg-grey-800 text-sm text-gray-500 px-3 text-center">
              {link.accessCount} acessos
            </div>
            <div className="space-x-1 w-18">
              <button
                type="button"
                onClick={() => handleCopyLink(link.shortUrl)}
                className="p-2 bg-gray-200 hover:outline-2 hover:outline-blue-base rounded"
                title="Copiar"
              >
                <Copy size={16} className="text-gray-600" />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteLink(link.shortUrl)}
                className="p-2 bg-gray-200 hover:outline-2 hover:outline-blue-base rounded"
                title="Excluir"
              >
                <Trash size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}