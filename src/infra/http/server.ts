import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { hasZodFastifySchemaValidationErrors, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { getLinks } from "./routes/links";

const server = fastify();

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.validation,
    })
  }

  return reply.status(500).send({ message: 'Internal server error' })
})

server.register(fastifyCors, { origin: "*" });
server.register(getLinks);

server.listen({ port: 3333 }, () => {
  console.log("HTTP server running!");
});
