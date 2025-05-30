import { randomUUID } from 'node:crypto'
import { exportLinks } from '@/app/functions/export-links'
import { isRight, unwrapEither } from '@/infra/shared/either'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { makeLink } from '@/test/factories/make-link'
import { describe, expect, it, vi } from 'vitest'

describe('export links', () => {
  it('should be able to export links', async () => {
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: 'http://example.com/file.csv',
        }
      })

    const createdLinks = await Promise.all([
      makeLink(),
      makeLink(),
      makeLink(),
      makeLink(),
      makeLink(),
    ])

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

    expect(csvAsArray[0]).toEqual(
      ['ID', 'Original URL', 'Short URL', 'Access Count', 'Created at'],
    )
    createdLinks.forEach((createdLink) => {
      expect(csvAsArray).toContainEqual([
        createdLink.id.toString(),
        createdLink.originalUrl,
        createdLink.shortUrl,
        createdLink.accessCount.toString(),
        expect.any(String),
      ])
    })
  })
})
