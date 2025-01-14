ARG NODE_VERSION=22.13

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /www
EXPOSE 3000

RUN apk add --no-cache bash

FROM base as dev
RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/root/.npm \
  npm ci --include=dev
USER node
COPY . .
CMD npm run start

FROM base as prod
RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/root/.npm \
  npm ci --omit=dev
USER node
COPY . .
CMD npm run start
