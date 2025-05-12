import { env } from "@/env";
import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";

const server = fastify();

server.register(fastifyCors, {
  origin: "*",
});

server.listen({ port: 3333 }, () => {
  console.log("HTTP server running!");
});
