FROM node:20-alpine

WORKDIR /app

# Copy root config for monorepo
COPY package*.json turbo.json ./

# Copy API package files
COPY apps/api/package*.json apps/api/
COPY apps/api/nest-cli.json apps/api/
COPY apps/api/tsconfig*.json apps/api/
COPY apps/api/prisma apps/api/prisma

# Install dependencies (monorepo structure)
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

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main.js"]
