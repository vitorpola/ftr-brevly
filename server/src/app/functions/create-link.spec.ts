import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { createLink, createLinkInput } from './create-link'
import { makeLink } from '@/test/factories/make-link'
import { clearLinks } from '@/test/factories/clear-links'

describe('createLink', () => {
  it('should create a link successfully', async () => {
    clearLinks()
    const validInput = {
      shortUrl: 'test-short-url-1',
      originalUrl: 'https://example.com',
    }

    const result = await createLink(validInput)

    expect(isRight(result)).toBe(true)

    const createdLink = await db.query.links.findFirst({
      where: (fields, { eq }) => eq(fields.shortUrl, validInput.shortUrl),
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
    const createdLink = await makeLink()
    const validInput = {
      shortUrl: createdLink.shortUrl,
      originalUrl: 'https://example.com',
    }

    const result = await createLink(validInput)

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(unwrapEither(result)).toBeInstanceOf(Error)
    }
  })
})
