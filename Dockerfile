FROM oven/bun:1 as base

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1 as production

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy built application
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/bun.lock ./bun.lock
COPY --from=base /app/next.config.js ./next.config.js
COPY --from=base /app/tailwind.config.ts ./tailwind.config.ts
COPY --from=base /app/tsconfig.json ./tsconfig.json
COPY --from=base /app/src/db ./src/db
COPY --from=base /app/src/app/globals.css ./src/app/globals.css

# Install only production dependencies
RUN bun install --frozen-lockfile --production

# Set environment variables for better performance
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application with optimized settings
CMD ["bun", "start"] 