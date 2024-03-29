FROM node:21-bullseye-slim AS build

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /usr/src/app
COPY . .

RUN npm install
RUN npm run build
RUN npm ci --only=production && npm cache clean --force

FROM node:21-bullseye-slim

ENV NODE_ENV production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

USER node
WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=build /usr/src/app/dist         /usr/src/app/dist

COPY --chown=node:node . /usr/src/app

CMD ["dumb-init", "node", "dist/main"]
