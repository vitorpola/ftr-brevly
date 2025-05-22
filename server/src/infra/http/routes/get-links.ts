import { getLinks } from '@/app/functions/get-links'
import { unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

export const getLinksRoute: FastifyPluginAsync = async server => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'Listar links encurtados',
        tags: ['links'],
        response: {
          200: z.object({
            links: z.array(
              z.object({
                id: z.string(),
                shortUrl: z.string(),
                originalUrl: z.string(),
                accessCount: z.number(),
                createdAt: z.date(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await getLinks()

      const { links } = unwrapEither(result)

      return reply.status(200).send({ links })
    }
  )
}
