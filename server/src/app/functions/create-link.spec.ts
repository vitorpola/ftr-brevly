import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createLink, createLinkInput } from './create-link'

describe('createLink', () => {
  const validInput = {
    shortUrl: 'test-short-url',
    originalUrl: 'https://example.com',
  }

  beforeEach(async () => {
    await db.delete(links)
  })

  afterEach(async () => {
    await db.delete(links)
  })

  it('should create a link successfully', async () => {
    const result = await createLink(validInput)

    expect(isRight(result)).toBe(true)

    const createdLink = await db.query.links.findFirst({
      where: eq(links.shortUrl, validInput.shortUrl),
    })

    expect(createdLink).toBeDefined()
    expect(createdLink?.originalUrl).toBe(validInput.originalUrl)
    expect(createdLink?.shortUrl).toBe(validInput.shortUrl)
  })

  it('should validate input using zod schema', () => {
    const invalidInputs = [
      { key: '', url: 'https://example.com' },
      { key: 'test', url: 'not-a-url' },
      { key: 'test' },
      { url: 'https://example.com' },
    ]

    for (const input of invalidInputs) {
      const result = createLinkInput.safeParse(input)
      expect(result.success).toBe(false)
    }
  })

  it('should not allow duplicate keys', async () => {
    await createLink(validInput)

    const result = await createLink(validInput)

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(unwrapEither(result)).toBeInstanceOf(Error)
    }
  })
})
