import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { hasZodFastifySchemaValidationErrors, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { getLinksRoute } from "./routes/get-links";
import { createLinkRoute } from "./routes/create-link";
import { exportUploadsRoute } from "./routes/export-links";
import { deleteLinkRoute } from "./routes/delete-link";
import { accessLinkRoute } from "./routes/access-link";
import { getLinkRoute } from "./routes/get-link";
import { transformSwaggerSchema } from "./transform-swagger-schema";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

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
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brev.ly API',
      version: '1.0.0',
    },
  },
  transform: transformSwaggerSchema,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

server.register(getLinksRoute);
server.register(getLinkRoute);
server.register(createLinkRoute);
server.register(exportUploadsRoute);
server.register(deleteLinkRoute);
server.register(accessLinkRoute);

server.listen({ port: 3333 }, () => {
  console.log("HTTP server running!");
});
