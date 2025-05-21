import { getLinks } from '@/app/functions/get-links'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'

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

    const sut = await getLinks({ sortBy: 'shortUrl', sortDirection: 'desc' })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })

  it('should be able to get paginated links', async () => {
    const link1 = await makeLink({ shortUrl: 'rocket1' })
    const link2 = await makeLink({ shortUrl: 'rocket2' })
    const link3 = await makeLink({ shortUrl: 'rocket3' })
    const link4 = await makeLink({ shortUrl: 'rocket4' })
    const link5 = await makeLink({ shortUrl: 'rocket5' })

    let sut = await getLinks({
      sortBy: 'shortUrl',
      sortDirection: 'desc',
      page: 1,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
    ])

    sut = await getLinks({
      sortBy: 'shortUrl',
      sortDirection: 'desc',
      page: 2,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })

  it('should be able to get sorted links', async () => {
    const link1 = await makeLink({
      createdAt: new Date(),
    })

    const link2 = await makeLink({
      createdAt: dayjs().subtract(1, 'day').toDate(),
    })

    const link3 = await makeLink({
      createdAt: dayjs().subtract(2, 'day').toDate(),
    })

    const link4 = await makeLink({
      createdAt: dayjs().subtract(3, 'day').toDate(),
    })

    const link5 = await makeLink({
      createdAt: dayjs().subtract(4, 'day').toDate(),
    })

    let sut = await getLinks({
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link1.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link5.id }),
    ])

    sut = await getLinks({
      sortBy: 'createdAt',
      sortDirection: 'asc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link5.id }),
      expect.objectContaining({ id: link4.id }),
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })
})