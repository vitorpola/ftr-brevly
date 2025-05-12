import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createLink, createLinkInput } from "@/app/functions/create-link";

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post('/links', {
    schema: {
      body: createLinkInput
    }
  }, async (request, reply) => {
    const input = createLinkInput.parse(request.body)
    const link = await createLink(input)
    return reply.status(201).send(link)
  })
}