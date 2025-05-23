import { env } from '@/env'
import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { accessLinkRoute } from './routes/access-link'
import { createLinkRoute } from './routes/create-link'
import { deleteLinkRoute } from './routes/delete-link'
import { exportUploadsRoute } from './routes/export-links'
import { getLinkRoute } from './routes/get-link'
import { getLinksRoute } from './routes/get-links'
import { transformSwaggerSchema } from './transform-swagger-schema'

const server = fastify({
  logger: env.NODE_ENV !== 'production',
})

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

server.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})
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

server.register(getLinksRoute)
server.register(getLinkRoute)
server.register(createLinkRoute)
server.register(exportUploadsRoute)
server.register(deleteLinkRoute)
server.register(accessLinkRoute)

server.listen({ port: 3333 }, () => {
  console.log('HTTP server running!')
})
