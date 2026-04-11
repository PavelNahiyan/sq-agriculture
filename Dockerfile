FROM node:20-alpine

WORKDIR /app

# Copy root level files first (monorepo structure)
COPY package*.json ./
COPY turbo.json ./

# Copy API package files
COPY apps/api/package*.json ./apps/api/
COPY apps/api/nest-cli.json ./apps/api/
COPY apps/api/tsconfig*.json ./apps/api/

# Copy shared package
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/api/src ./apps/api/src
COPY packages/shared/src ./packages/shared/src

# Generate Prisma client
RUN cd apps/api && npx prisma generate

# Build
RUN npm run build --workspace=apps/api

# Production runtime
FROM node:20-alpine
WORKDIR /app

COPY --from=0 /app/apps/api/node_modules ./node_modules
COPY --from=0 /app/apps/api/dist ./dist
COPY --from=0 /app/apps/api/node_modules/.prisma ./node_modules/.prisma
COPY --from=0 /app/apps/api/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/main.js"]
