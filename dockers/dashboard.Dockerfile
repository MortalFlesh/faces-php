# Multi-stage build for Faces Dashboard
# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Install bash, curl, and network tools
RUN apk add --no-cache bash curl iputils

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code and configuration
COPY .babelrc tsconfig.json webpack.config.js ./
COPY src/ ./src/
COPY public/ ./public/

# Build the application
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Install bash, curl, and network tools
RUN apk add --no-cache bash curl iputils

# Copy built files from builder stage
COPY --from=builder /app/public /usr/share/nginx/html

# Copy nginx configuration
COPY etc/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

