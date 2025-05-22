import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { type AnyColumn, eq, sql } from 'drizzle-orm'
import { z } from 'zod'

export const accessLinkInput = z.object({
  shortUrl: z.string(),
})

const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`
}

type AccessLinkInput = z.input<typeof accessLinkInput>

export async function accessLink(
  input: AccessLinkInput
): Promise<Either<Error, void>> {
  const { shortUrl } = accessLinkInput.parse(input)

  const existingLink = await db
    .select({})
    .from(schema.links)
    .where(eq(schema.links.shortUrl, shortUrl))
    .limit(1)

  if (existingLink.length === 0) {
    return makeLeft(new Error(`Link "${shortUrl}" not found`))
  }

  await db
    .update(schema.links)
    .set({
      accessCount: increment(schema.links.accessCount),
    })
    .where(eq(schema.links.shortUrl, shortUrl))

  return makeRight(undefined)
}
