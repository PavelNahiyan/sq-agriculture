FROM node:20-alpine AS builder

WORKDIR /app

# Copy all files needed for build
COPY package*.json ./
COPY turbo.json ./
COPY apps/ apps/
COPY packages/ packages/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN cd apps/api && npx prisma generate

# Build the API
RUN npm run build --workspace=apps/api

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main.js"]
