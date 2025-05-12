import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createLink, createLinkInput } from './create-link'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { eq } from 'drizzle-orm'
import { isRight, isLeft, unwrapEither } from '@/infra/shared/either'

describe('createLink', () => {
  const validInput = {
    shortUrl: 'test-short-url',
    originalUrl: 'https://example.com'
  }

  beforeEach(async () => {
    // Limpa a tabela de links antes de cada teste
    await db.delete(links)
  })

  afterEach(async () => {
    // Limpa a tabela de links depois de cada teste
    await db.delete(links)
  })

  it('should create a link successfully', async () => {
    const result = await createLink(validInput)

    expect(isRight(result)).toBe(true)

    // Verifica se o link foi realmente criado no banco
    const createdLink = await db.query.links.findFirst({
      where: eq(links.short_url, validInput.shortUrl)
    })

    expect(createdLink).toBeDefined()
    expect(createdLink?.original_url).toBe(validInput.originalUrl)
    expect(createdLink?.short_url).toBe(validInput.shortUrl)
  })

  it('should validate input using zod schema', () => {
    const invalidInputs = [
      { key: '', url: 'https://example.com' }, // key vazia
      { key: 'test', url: 'not-a-url' }, // URL inválida
      { key: 'test' }, // URL faltando
      { url: 'https://example.com' }, // key faltando
    ]

    invalidInputs.forEach(input => {
      const result = createLinkInput.safeParse(input)
      expect(result.success).toBe(false)
    })
  })

  it('should not allow duplicate keys', async () => {
    // Primeira criação
    await createLink(validInput)

    // Tenta criar novamente com a mesma key
    const result = await createLink(validInput)
    
    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(unwrapEither(result)).toBeInstanceOf(Error)
    }
  })
})
