import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const getLinkInput = z.object({
  shortUrl: z.string(),
})

type GetLinkInput = z.input<typeof getLinkInput>

type GetLinkOutput = {
  link: {
    id: string
    shortUrl: string
    originalUrl: string
    accessCount: number
    createdAt: Date
  }
}

export async function getLink(
  input: GetLinkInput
): Promise<Either<Error, GetLinkOutput>> {
  const { shortUrl } = getLinkInput.parse(input)

  const [link] = await Promise.all([
    db
      .select({
        id: schema.links.id,
        shortUrl: schema.links.shortUrl,
        originalUrl: schema.links.originalUrl,
        accessCount: schema.links.accessCount,
        createdAt: schema.links.createdAt,
      })
      .from(schema.links)
      .where(eq(schema.links.shortUrl, shortUrl))
      .limit(1),
  ])

  if (!link || link.length === 0) {
    return makeLeft(new Error(`Link "${shortUrl}" not found`))
  }

  return makeRight({ link: link[0] })
}
