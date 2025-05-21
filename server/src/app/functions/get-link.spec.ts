import { getLink } from '@/app/functions/get-link'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'

describe('get link', () => {
  beforeEach(async () => {
    await db.delete(links)
  })

  afterEach(async () => {
    await db.delete(links)
  })
  
  it('should be able to get the specific link', async () => {
    const link = await makeLink({ shortUrl: 'rocket1' })
    await makeLink({ shortUrl: 'rocket2' })

    const sut = await getLink({ shortUrl: 'rocket1' })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      link: {
        id: link.id,
        originalUrl: link.originalUrl,
        shortUrl: link.shortUrl,
        accessCount: link.accessCount,
        createdAt: expect.any(Date)
      }
    })
  })


  it('should not be able to get the specific link', async () => {
    await makeLink({ shortUrl: 'rocket1' })
    await makeLink({ shortUrl: 'rocket2' })

    const sut = await getLink({ shortUrl: 'rocket3' })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(new Error('Link "rocket3" not found'))
  })
})
