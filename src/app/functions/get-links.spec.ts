import { getLinks } from '@/app/functions/get-links'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { fakerPT_BR as faker } from '@faker-js/faker'
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
    const link1 = await makeLink()
    const link2 = await makeLink()
    const link3 = await makeLink()
    const link4 = await makeLink()
    const link5 = await makeLink()

    const sut = await getLinks({ searchQuery: 'www' })

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
    const link1 = await makeLink()
    const link2 = await makeLink()
    const link3 = await makeLink()
    const link4 = await makeLink()
    const link5 = await makeLink()

    let sut = await getLinks({
      searchQuery: 'wwww',
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
      searchQuery: 'www',
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
      searchQuery: 'www',
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
      searchQuery: 'www',
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