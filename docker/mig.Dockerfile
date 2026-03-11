FROM node:24-alpine

WORKDIR /app

# Install Prisma CLI globally and create non-root user
RUN npm install -g prisma@7.4.1 && \
    adduser -D -u 1001 migrations

# Copy package files, prisma config, schema and migrations first
COPY package*.json ./
COPY prisma.config.ts ./prisma.config.ts
COPY prisma ./prisma

# Install dependencies (postinstall needs prisma files)
RUN npm ci --omit=dev && npm cache clean --force

# Switch to non-root user
USER 1001

# Set environment variable check + migration execution as entrypoint
ENTRYPOINT ["/bin/sh", "-c", "\
  if [ -z \"$DATABASE_URL\" ]; then \
    echo '❌ DATABASE_URL is not set'; \
    exit 1; \
  fi && \
  echo 'Running migrations...' && \
  prisma migrate deploy && \
  echo 'Migrations completed successfully' \
  "]
