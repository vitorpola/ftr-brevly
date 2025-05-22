import { Copy, Download, Link, Trash } from "@phosphor-icons/react";
import { useContextSelector } from "use-context-selector";
import { LinksContext } from "../contexts/LinksContext";
import { env } from "../env";

export function MyLinksCard() {

  const deleteLink = useContextSelector(
    LinksContext,
    (context) => {
      return context.deleteLink
    },
  )

  const links = useContextSelector(LinksContext, (context) => {
    return context.links
  })

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex-1 w-full">
        <div className="text-center text-gray-500 mt-10">
          <div className="flex justify-center mb-2">
            <Link size={32} />
          </div>
          <p className="text-sm">AINDA NÃO EXISTEM LINKS CADASTRADOS</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 flex-1 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Meus links</h2>
        <button className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 border px-3 py-1 rounded hover:bg-gray-200 transition">
          <Download size={32} />
          Baixar CSV
        </button>
      </div>
      <div className="space-y-4">
      {links.map((link) => (
          <div key={link.shortUrl} className="flex justify-between items-center border-t pt-4">
            <div>
              <a
                href={link.shortUrl}
                onClick={() => accessLink(link)}
                className="text-blue-base hover:underline block"
                target="_blank"
                rel="noopener noreferrer"
              >
                {env.VITE_FRONTEND_URL}/{link.shortUrl}
              </a>
              <p className="text-sm text-gray-500 truncate w-56">{link.originalUrl}</p>
              <p className="text-sm text-gray-700 mt-1">{link.accessCount} acessos</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(link.shortUrl);
                }}
                className="p-2 hover:bg-gray-100 rounded"
                title="Copiar"
              >
                <Copy size={20} />
              </button>
              <button
                onClick={() => deleteLink(link.shortUrl)}
                className="p-2 hover:bg-gray-100 rounded"
                title="Excluir"
              >
                <Trash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}