# Demo CI/CD Project Dockerfile
# Multi-stage build voor optimale image grootte

# Stage 1: Build
FROM node:18-alpine AS builder

# Metadata
LABEL maintainer="Student <student@example.com>"
LABEL description="Demo CI/CD Project"

# Werk directory instellen
WORKDIR /app

# Copy package files voor dependency caching
COPY package*.json ./

# Install dependencies (alleen production voor kleinere image)
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/

# Stage 2: Production
FROM node:18-alpine AS production

# Installeer security updates en utilities
RUN apk add --no-cache \
    dumb-init \
    curl \
    && addgroup -g 1001 -S nodejs \
    && adduser -S nodejs -u 1001

# Werk directory instellen
WORKDIR /app

# Copy van builder stage
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --chown=nodejs:nodejs package*.json ./

# Maak logs directory
RUN mkdir -p logs && chown nodejs:nodejs logs

# Switch naar non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start applicatie met dumb-init voor proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/app.js"]
