import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const deleteLinkInput = z.object({
  shortUrl: z.string(),
})

type DeleteLinkInput = z.input<typeof deleteLinkInput>

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<Error, null>> {
  const { shortUrl } = deleteLinkInput.parse(input)

  const existingLink = await db
    .select({})
    .from(schema.links)
    .where(eq(schema.links.shortUrl, shortUrl))
    .limit(1)

  if (existingLink.length === 0) {
    return makeLeft(new Error(`Link "${shortUrl}" not found`))
  }

  await db
    .delete(schema.links)
    .where(eq(schema.links.shortUrl, shortUrl))

  return makeRight(null)
}