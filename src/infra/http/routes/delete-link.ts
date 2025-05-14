import { deleteLink, deleteLinkInput } from "@/app/functions/delete-link";
import { isLeft, unwrapEither } from "@/infra/shared/either";
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

export const deleteLinkRoute: FastifyPluginAsync = async server => {
  server.delete("/links/:shortUrl", {
    schema: {
      summary: 'Excluir link encurtado',
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
      request.params as z.infer<typeof deleteLinkInput>
    
    const result = await deleteLink({ shortUrl })

    if (isLeft(result)) {
      const error = unwrapEither(result)
      return reply.status(404).send({ message: error.message })
    }

    return reply.status(204)
  });
};
