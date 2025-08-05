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

# Copy built application
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/bun.lock ./bun.lock
COPY --from=base /app/next.config.js ./next.config.js
COPY --from=base /app/tailwind.config.ts ./tailwind.config.ts
COPY --from=base /app/tsconfig.json ./tsconfig.json
COPY --from=base /app/src/db ./src/db

# Install only production dependencies
RUN bun install --frozen-lockfile --production

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "start"] 