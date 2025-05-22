import { randomUUID } from 'node:crypto'
import { exportLinks } from '@/app/functions/export-links'
import { db } from '@/infra/db'
import { links } from '@/infra/db/schemas/links'
import { isRight, unwrapEither } from '@/infra/shared/either'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { makeLink } from '@/test/factories/make-link'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('export links', () => {
  beforeEach(async () => {
    await db.delete(links)
  })

  afterEach(async () => {
    await db.delete(links)
  })

  it('should be able to export links', async () => {
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: 'http://example.com/file.csv',
        }
      })

    const namePattern = randomUUID()

    const upload1 = await makeLink()
    const upload2 = await makeLink()
    const upload3 = await makeLink()
    const upload4 = await makeLink()
    const upload5 = await makeLink()

    const sut = await exportLinks()

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream
    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      generatedCSVStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      generatedCSVStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'))
      })

      generatedCSVStream.on('error', err => {
        reject(err)
      })
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(row => row.split(','))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).reportUrl).toBe('http://example.com/file.csv')
    expect(csvAsArray).toEqual([
      ['ID', 'Original URL', 'Short URL', 'Access Count', 'Created at'],
      [
        upload1.id,
        upload1.originalUrl,
        upload1.shortUrl,
        upload1.accessCount.toString(),
        expect.any(String),
      ],
      [
        upload2.id,
        upload2.originalUrl,
        upload2.shortUrl,
        upload2.accessCount.toString(),
        expect.any(String),
      ],
      [
        upload3.id,
        upload3.originalUrl,
        upload3.shortUrl,
        upload3.accessCount.toString(),
        expect.any(String),
      ],
      [
        upload4.id,
        upload4.originalUrl,
        upload4.shortUrl,
        upload4.accessCount.toString(),
        expect.any(String),
      ],
      [
        upload5.id,
        upload5.originalUrl,
        upload5.shortUrl,
        upload5.accessCount.toString(),
        expect.any(String),
      ],
    ])
  })
})
