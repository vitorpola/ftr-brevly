import { getLink } from '@/app/functions/get-link'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { describe, expect, it } from 'vitest'

describe('get link', () => {
  it('should be able to get the specific link', async () => {
    const createdLinks = await Promise.all([makeLink(), makeLink()])
    const sut = await getLink({ shortUrl: createdLinks[0].shortUrl })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      link: {
        id: createdLinks[0].id,
        originalUrl: createdLinks[0].originalUrl,
        shortUrl: createdLinks[0].shortUrl,
        accessCount: createdLinks[0].accessCount,
        createdAt: expect.any(Date),
      },
    })
  })

  it('should not be able to get the specific link', async () => {
    await Promise.all([makeLink(), makeLink()])
    const sut = await getLink({ shortUrl: 'other' })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(new Error('Link "other" not found'))
  })
})
