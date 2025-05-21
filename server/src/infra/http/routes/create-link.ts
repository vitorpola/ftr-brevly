import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createLink, createLinkInput } from "@/app/functions/create-link";
import { isLeft, unwrapEither } from "@/infra/shared/either";

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post('/links', {
    schema: {
      body: createLinkInput,
      summary: 'Criar um link encurtado',
      tags: ['links']
    }
  }, async (request, reply) => {
    const input = createLinkInput.parse(request.body)
    const result = await createLink(input)

    if (isLeft(result)) {
      const error = unwrapEither(result)
      return reply.status(400).send({ message: error.message })
    }

    return reply.status(201).send({ id: result.right })
  })
}