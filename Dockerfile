FROM node:20-alpine AS builder

WORKDIR /app

# Copy root config files
COPY package.json package-lock.json turbo.json ./

# Copy API app files
COPY apps/api/package.json apps/api/package-lock.json apps/api/
COPY apps/api/nest-cli.json apps/api/
COPY apps/api/tsconfig.json apps/api/
COPY apps/api/tsconfig.build.json apps/api/
COPY apps/api/prisma apps/api/prisma

# Install dependencies (monorepo installs all workspaces)
RUN npm ci

# Copy API source
COPY apps/api/src apps/api/src

# Generate Prisma client
RUN cd apps/api && npx prisma generate

# Build the API
RUN npm run build --workspace=apps/api

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/apps/api/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main.js"]
