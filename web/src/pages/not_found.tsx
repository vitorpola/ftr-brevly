import notFoundImg from '../assets/404.svg'
import { env } from '../env'

export function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen p-4">
      <div className="bg-white rounded-lg p-10 text-center lg:w-1/2 w-full">
        <img src={notFoundImg} alt="Brevly" className="center inline" />
        <p className="text-lg font-semibold mb-2">Link não encontrado</p>
        <p className="text-sm ">O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em&nbsp;
          <a href={env.VITE_FRONTEND_URL} className="text-blue-500 hover:underline">
            brev.ly
          </a>
        </p>
      </div>
    </div>
  )
}