import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeLink(
  overrides?: Partial<InferInsertModel<typeof schema.links>>
) {
  const shortUrl = faker.internet.domainName()

  const result = await db
    .insert(schema.links)
    .values({
      originalUrl: `http://www.example-${shortUrl}`,
      shortUrl: shortUrl,
      ...overrides,
    })
    .returning()

  return result[0]
}
