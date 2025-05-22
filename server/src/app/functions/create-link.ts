import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { z } from 'zod'

export const createLinkInput = z.object({
  shortUrl: z
    .string()
    .min(5, 'A URL encurtada deve ter no mínimo 5 caracteres')
    .max(24, 'A URL encurtada deve ter no máximo 24 caracteres')
    .regex(/^[a-z0-9-_]+$/, {
      message:
        'A URL encurtada deve conter apenas letras minúsculas, números, hífen ou underline',
    }),
  originalUrl: z.string().url(),
})

type CreateLinkInput = z.infer<typeof createLinkInput>

export async function createLink(
  input: CreateLinkInput
): Promise<Either<Error, string>> {
  try {
    const [link] = await db
      .insert(links)
      .values({
        shortUrl: input.shortUrl,
        originalUrl: input.originalUrl,
      })
      .returning({ id: links.id })

    return makeRight(link.id)
  } catch (error) {
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return makeLeft(
        new Error(`Essa URL encurtada "${input.shortUrl}" já existe.`)
      )
    }
    return makeLeft(
      error instanceof Error
        ? error
        : new Error('Um erro desconhecido ocorreu.')
    )
  }
}
