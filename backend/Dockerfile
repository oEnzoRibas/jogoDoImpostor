# backend/Dockerfile
FROM node:24-slim AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- Stage de Desenvolvimento ---
FROM base AS dev
ENV NODE_ENV=development
COPY . .
CMD ["npm", "run", "dev"]

# --- Stage de Produção ---
FROM base AS build
COPY . .
RUN npm run build

FROM node:24-slim AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
ENV NODE_ENV=production
USER node
CMD ["node", "dist/server.js"]