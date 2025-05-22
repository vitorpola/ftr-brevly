import { getLinks } from '@/app/functions/get-links'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('get links', () => {
  beforeEach(async () => {
    await db.delete(links)
  })

  afterEach(async () => {
    await db.delete(links)
  })

  it('should be able to get the links', async () => {
    const link1 = await makeLink({ shortUrl: 'rocket1' })
    const link2 = await makeLink({ shortUrl: 'rocket2' })
    const link3 = await makeLink({ shortUrl: 'rocket3' })
    const link4 = await makeLink({ shortUrl: 'rocket4' })
    const link5 = await makeLink({ shortUrl: 'rocket5' })

    const sut = await getLinks()

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })
})
