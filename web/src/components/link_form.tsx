import { zodResolver } from '@hookform/resolvers/zod'
import { Warning } from "@phosphor-icons/react";
import { useForm } from 'react-hook-form'
import { useContextSelector } from "use-context-selector";
import * as z from 'zod'
import { LinksContext } from "../contexts/LinksContext";

const shortUrlErrorMessage = "Informe uma url minúscula e sem espaços/caracteres especiais"
const newLinkFormSchema = z.object({
  originalUrl: z.string().url({ message: 'Informe uma url válida.' }),
  shortUrl: z.string().regex(/^[a-z0-9-_]+$/, { message: shortUrlErrorMessage }),
})

type NewLinkFormInputs = z.infer<typeof newLinkFormSchema>

export function LinkForm() {
  const createLink = useContextSelector(LinksContext, ctx => ctx.createLink)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<NewLinkFormInputs>({
    resolver: zodResolver(newLinkFormSchema),
    defaultValues: {
      originalUrl: '',
      shortUrl: '',
    },
  })

  async function handleCreateNewLink(data: NewLinkFormInputs) {
    const { originalUrl, shortUrl } = data

    const created = await createLink({ originalUrl, shortUrl })

    if(created) reset()
  }

  return (
    <form onSubmit={handleSubmit(handleCreateNewLink)}>
      <div className="bg-white rounded-lg p-6 w-full">
        <h2 className="text-lg font-semibold mb-4 text-gray-600">Novo link</h2>

          <div className="text-gray-500 mb-2">
            <label htmlFor="link-original" className="text-xs text-gray-500 peer-focus:text-blue-base peer-focus:font-semibold">LINK ORIGINAL</label>

            <input id="link-original" type="text" placeholder="http://www.exemplo.com.br"
              className="w-full border border-gray-300 rounded-lg p-4 text-gray-800 focus:outline-2 focus:outline-blue-base peer"

              {...register('originalUrl')}

              />
              {errors.originalUrl && (
                <p className="text-sm mt-1">
                  <Warning className="mr-1 text-danger inline-block" />
                  {errors.originalUrl.message}
                </p>
              )}
          </div>
          <div className="text-gray-500 mb-2">

            <label htmlFor="short-url" className="text-xs text-gray-500 peer-focus:text-blue-base peer-focus:font-semibold">LINK ENCURTADO</label>

            <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-base">
              <div className="shrink-0 text-base text-gray-400 select-none sm:text-sm/6">brev.ly/</div>
              <input type="text" id="short-url" className="py-4 pr-3 pl-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              {...register('shortUrl')}
              />
            </div>
            {errors.shortUrl && (
              <p className="text-sm mt-1">
                <Warning className="mr-1 text-danger inline-block" />
                {errors.shortUrl.message}
              </p>
            )}
        </div>
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-blue-base hover:bg-blue-dark text-white font-semibold py-2 rounded-md transition">
            Salvar link
          </button>
      </div>
    </form>
  )
}