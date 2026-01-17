# backend/Dockerfile
FROM node:24-slim AS base

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
COPY backend/package.json backend/
COPY packages/shared/package.json packages/shared/

RUN npm install

# --- DEV ---
FROM base AS dev
ENV NODE_ENV=development

COPY packages/shared packages/shared
COPY backend backend

WORKDIR /usr/src/app/backend

CMD ["npm", "run", "dev"]

# --- BUILD ---
FROM base AS build
COPY packages/shared packages/shared
COPY backend backend
WORKDIR /usr/src/app/backend
RUN npm run build

# --- PROD ---
FROM node:24-slim AS prod
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules

COPY --from=build /usr/src/app/backend/dist ./backend/dist
COPY --from=build /usr/src/app/backend/package.json ./backend/

WORKDIR /usr/src/app/backend
ENV NODE_ENV=production
USER node
CMD ["node", "dist//backend/src/server.js"]