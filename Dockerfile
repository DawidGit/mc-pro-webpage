# =============================================================================
# Dockerfile - Summit Commercial Construction Website
# Multi-stage production build with Nginx
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build Environment
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --only=production=false --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production Environment
# -----------------------------------------------------------------------------
FROM nginx:1.25-alpine-slim AS production

# Install security updates and required packages
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
        curl \
        ca-certificates && \
    rm -rf /var/cache/apk/*

# Create non-root user for nginx (only if missing in base image)
RUN if ! grep -q '^nginx:' /etc/group; then addgroup -g 1001 -S nginx; fi && \
    if ! id -u nginx >/dev/null 2>&1; then adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx nginx; fi

# Remove default nginx configuration
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-site.conf /etc/nginx/conf.d/site.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 8080

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/healthz || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
