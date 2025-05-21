import { accessLink } from '@/app/functions/access-link'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'

describe('access link', () => {
  beforeEach(async () => {
    await db.delete(links)
  })

  afterEach(async () => {
    await db.delete(links)
  })
  
  it('should be able to access the specific link', async () => {
    const link = await makeLink({ shortUrl: 'rocket1' })
    await makeLink({ shortUrl: 'rocket2' })

    const sut = await accessLink({ shortUrl: 'rocket1' })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({})
  })


  it('should not be able to access the specific link', async () => {
    await makeLink({ shortUrl: 'rocket1' })
    await makeLink({ shortUrl: 'rocket2' })

    const sut = await accessLink({ shortUrl: 'rocket3' })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(new Error('Link not found'))
  })
})
