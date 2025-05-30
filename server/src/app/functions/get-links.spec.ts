import { getLinks } from '@/app/functions/get-links'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { describe, expect, it } from 'vitest'

describe('get links', () => {
  it('should be able to get the links', async () => {
    const createdLinks = await Promise.all([
      makeLink(),
      makeLink(),
      makeLink(),
      makeLink(),
      makeLink(),
    ])
    const sut = await getLinks()
    const responseLinks = unwrapEither(sut).links

    expect(isRight(sut)).toBe(true)
    createdLinks.forEach((createdLink) => {
      expect(responseLinks).toContainEqual(createdLink)
    })
  })
})
