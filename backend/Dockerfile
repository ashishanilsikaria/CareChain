# CareChain Backend Production Dockerfile
FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose Gateway Port
EXPOSE 10000

# Start server
CMD ["node", "server.js"]
