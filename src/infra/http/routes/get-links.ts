import { FastifyPluginAsync } from "fastify";

export const getLinksRoute: FastifyPluginAsync = async (server) => {
  server.get("/links", async (request, reply) => {
    
    return reply.status(200).send([]);
  });
};
