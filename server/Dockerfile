FROM node:22.16-bookworm-slim AS base

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build
RUN pnpm prune --prod

EXPOSE 3333

CMD ["pnpm", "start"]