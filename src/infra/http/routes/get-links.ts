import { getLinks, getLinksInput } from "@/app/functions/get-links";
import { unwrapEither } from "@/infra/shared/either";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

export const getLinksRoute: FastifyPluginAsync = async server => {
  server.get("/links", {
    schema: {
      summary: 'Listar links encurtados',
      tags: ['links'],
      querystring: z.object({
        searchQuery: z.string().optional(),
        sortBy: z.enum(['createdAt', 'accessCount', 'shortUrl']).optional(),
        sortDirection: z.enum(['asc', 'desc']).optional(),
        page: z.coerce.number().optional().default(1),
        pageSize: z.coerce.number().optional().default(20),
      }),
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
          total: z.number(),
        }),
      },
    },
  }, async (request, reply) => {
    const { page, pageSize, sortBy, sortDirection } =
      request.query as z.infer<typeof getLinksInput>
    
    const result = await getLinks({
      sortBy,
      sortDirection,
      page,
      pageSize,
    })

    const { total, links } = unwrapEither(result)

    return reply.status(200).send({ total, links })
  });
};
