# frontend/Dockerfile
FROM node:24-slim AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- Stage de Desenvolvimento ---
FROM base AS dev
ENV NODE_ENV=development
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]

# --- Stage de Build ---
FROM base AS build
COPY . .
RUN npm run build

# --- Stage de Produção ---
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]