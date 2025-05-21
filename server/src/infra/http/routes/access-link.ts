import { accessLink, accessLinkInput } from "@/app/functions/access-link";
import { isLeft, unwrapEither } from "@/infra/shared/either";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";


export const accessLinkRoute: FastifyPluginAsync = async server => {
  server.put("/links/:shortUrl", {
    schema: {
      summary: 'Contar acesso de um link encurtado',
      tags: ['links'],
      params: z.object({
        shortUrl: z.string(),
      }),
      response: {
        204: z.object({}),
      },
    },
  }, async (request, reply) => {
    const { shortUrl } =
      request.params as z.infer<typeof accessLinkInput>
    
    const result = await accessLink({ shortUrl })

    if (isLeft(result)) {
      const error = unwrapEither(result)
      return reply.status(404).send({ message: error.message })
    }

    return reply.status(204)
  });
};
