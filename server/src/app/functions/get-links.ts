import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/infra/shared/either'

type GetLinksOutput = {
  links: {
    id: string
    shortUrl: string
    originalUrl: string
    accessCount: number
    createdAt: Date
  }[]
}

export async function getLinks(): Promise<Either<never, GetLinksOutput>> {
  const links = await db
    .select({
      id: schema.links.id,
      shortUrl: schema.links.shortUrl,
      originalUrl: schema.links.originalUrl,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)

  return makeRight({ links })
}
