# CareChain Backend Production Dockerfile
FROM oven/bun:1.4-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN bun install --production

# Copy source code
COPY . .

# Expose Gateway Port
EXPOSE 5000

# Start server
CMD ["bun", "server.js"]
