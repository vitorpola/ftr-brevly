import { getLink, getLinkInput } from "@/app/functions/get-link";
import { isLeft, unwrapEither } from "@/infra/shared/either";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

export const getLinkRoute: FastifyPluginAsync = async server => {
  server.get("/links/:shortUrl", {
    schema: {
      summary: 'Coletar link encurtado',
      tags: ['links'],
      params: z.object({
        shortUrl: z.string(),
      }),
      response: {
        200: z.object({
          link: z.object({
            id: z.string(),
            shortUrl: z.string(),
            originalUrl: z.string(),
            accessCount: z.number(),
            createdAt: z.date(),
          }),
        }),
      },
    },
  }, async (request, reply) => {
    const { shortUrl } =
      request.params as z.infer<typeof getLinkInput>
    
    const result = await getLink({ shortUrl })
    console.log('result', result) 
    if (isLeft(result)) {
      const error = unwrapEither(result)
      return reply.status(404).send({ message: error.message })
    }

    const { link } = unwrapEither(result)

    return reply.status(200).send({ link })
  });
};
