
# 1. Build Stage
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./
COPY . .

# Install dependencies & build app
RUN npm install
RUN npm run build

# 2. Production Image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only what's needed
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

# Install only production deps
RUN npm install --production

EXPOSE 3000

# Start Nuxt app
CMD ["node", ".output/server/index.mjs"]
