import { deleteLink } from '@/app/functions/delete-link'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { describe, expect, it } from 'vitest'

describe('delete link', () => {
  it('should be able to delete the specific link', async () => {
    const createdLinks = await Promise.all([makeLink(), makeLink()])
    const sut = await deleteLink({ shortUrl: createdLinks[0].shortUrl })

    expect(isRight(sut)).toBe(true)
  })

  it('should not be able to delete the specific link', async () => {
    await Promise.all([makeLink(), makeLink()])
    const sut = await deleteLink({ shortUrl: 'other' })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(new Error('Link "other" not found'))
  })
})
