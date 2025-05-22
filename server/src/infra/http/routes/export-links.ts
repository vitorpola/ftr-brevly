import { exportLinks } from '@/app/functions/export-links'
import { unwrapEither } from '@/infra/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const exportUploadsRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links/export',
    {
      schema: {
        summary: 'Exportar links encurtados em csv',
        tags: ['links'],
        response: {
          200: z.object({
            reportUrl: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await exportLinks()

      const { reportUrl } = unwrapEither(result)

      return reply.status(200).send({ reportUrl })
    }
  )
}
