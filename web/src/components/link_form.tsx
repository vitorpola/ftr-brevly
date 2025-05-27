import { zodResolver } from '@hookform/resolvers/zod'
import { Warning } from "@phosphor-icons/react";
import { useState } from 'react';
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
  const [submiting, setSubmiting] = useState(false);

  const createLink = useContextSelector(LinksContext, ctx => ctx.createLink)

  const {
    register,
    handleSubmit,
    formState: { errors },
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

    setSubmiting(true)
    const created = await createLink({ originalUrl, shortUrl })
    setSubmiting(false)

    if(created) reset()
  }

  return (
    <form onSubmit={handleSubmit(handleCreateNewLink)} className='w-full'>
      <div className="bg-gray-100 rounded-lg p-6 lg:p-8">
        <h2 className="text-lg font-bold mb-5 text-gray-600">Novo link</h2>
          <div className="mb-3">
            <label htmlFor="original-url" className={`text-xs ${errors.originalUrl ? 'text-danger font-bold':'text-gray-500'} peer-focus:text-blue-base peer-focus:font-bold`}>LINK ORIGINAL</label>

            <input id="original-url" type="text" placeholder="http://www.exemplo.com.br"
              className={`w-full text-md border my-2 ${errors.originalUrl ? 'border-danger outline-1 outline-danger':'border-gray-300 focus:outline-blue-base'} rounded-lg p-4 text-gray-600 placeholder:text-gray-400 peer focus:outline-2 focus-within:-outline-offset-2`}
              {...register('originalUrl')}
              />

            {errors.originalUrl && (
              <p className="text-sm text-grey-500">
                <Warning size={14} className="mr-2 text-danger inline" />
                {errors.originalUrl.message}
              </p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="short-url" className={`text-xs ${errors.shortUrl ? 'text-danger font-bold':'text-gray-500'} peer-focus:text-blue-base peer-focus:font-bold`}>LINK ENCURTADO</label>

            <div className={`w-full text-md  my-2 ${errors.shortUrl ? 'border-danger outline-2 outline-danger':'outline-gray-300 focus-within:outline-2 focus-within:outline-blue-base'} flex items-center rounded-lg pl-4 outline-1 overflow-hidden`}>
              <div className="shrink-0 text-md text-gray-400 select-none">brev.ly/</div>
              <input type="text" id="short-url" className="block grow py-4 text-md text-gray-600 focus:outline-none peer"
              {...register('shortUrl')}
              />
            </div>

            {errors.shortUrl && (
              <p className="text-sm text-grey-500">
                <Warning size={14} className="mr-2 text-danger inline" />
                {errors.shortUrl.message}
              </p>
            )}
          </div>
        <button type="submit" disabled={submiting}
          className={`w-full bg-blue-base hover:bg-blue-dark text-white text-md font-semibold py-4 mt-2 rounded-lg ${submiting ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {submiting ? 'Salvando' : 'Salvar link' }
        </button>
      </div>
    </form>
  )
}


