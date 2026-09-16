# Multi-stage production build for CareChain Frontend
FROM oven/bun:1.4-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .
RUN bun run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
