import { Info } from "@phosphor-icons/react";
import { useContextSelector } from "use-context-selector";
import { LinksContext } from "../contexts/LinksContext";

export function Toast() {
  const toastError = useContextSelector(
    LinksContext,
    (context) => {
      return context.toastError
    },
  )

  return (
    <div>
     { toastError.message && (
       <div id="toast-simple" className="fixed flex items-center w-full max-w-xs p-4 space-x-4 right-5 bottom-5 text-red bg-white rounded-lg shadow-sm" role="alert">
          <Info className="inline-flex items-center justify-center shrink-0 w-8 h-8" />
          <p className="ps-4 text-sm font-normal">Erro no cadastro</p>
          <p className="ps-4 text-sm font-normal">{toastError.message}</p>
      </div>
     )}
    </div>
  )
}