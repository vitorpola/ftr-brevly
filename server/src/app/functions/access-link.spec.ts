import { accessLink } from '@/app/functions/access-link'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { describe, expect, it } from 'vitest'

describe('access link', () => {
  it('should be able to access the specific link', async () => {
    const createdLinks = await Promise.all([makeLink(), makeLink()])
    const sut = await accessLink(createdLinks[0])

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(true)
  })

  it('should not be able to access the specific link', async () => {
    await Promise.all([makeLink(), makeLink()])
    const sut = await accessLink({ shortUrl: 'other' })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(new Error('Link "other" not found'))
  })
})
