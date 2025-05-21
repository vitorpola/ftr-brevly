import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { deleteLink } from '@/app/functions/delete-link'

describe('delete link', () => {
  beforeEach(async () => {
    await db.delete(links)
  })

  afterEach(async () => {
    await db.delete(links)
  })
  
  it('should be able to delete the specific link', async () => {
    const link = await makeLink({ shortUrl: 'rocket1' })
    await makeLink({ shortUrl: 'rocket2' })

    const sut = await deleteLink({ shortUrl: link.shortUrl })

    expect(isRight(sut)).toBe(true)
  })

  it('should not be able to delete the specific link', async () => {
    await makeLink({ shortUrl: 'rocket1' })
    await makeLink({ shortUrl: 'rocket2' })

    const sut = await deleteLink({ shortUrl: 'rocket3' })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(new Error('Link "rocket3" not found'))
  })
})
