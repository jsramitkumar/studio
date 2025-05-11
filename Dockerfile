# Base image
FROM node:20-alpine AS base
WORKDIR /app
# Install libc6-compat for Next.js on Alpine
RUN apk add --no-cache libc6-compat

# Dependencies stage
FROM base AS deps
COPY package.json ./
# If you have a package-lock.json, uncomment the next line and use npm ci
# COPY package-lock.json ./
RUN npm install
# If using pnpm:
# COPY pnpm-lock.yaml ./
# RUN npm install -g pnpm && pnpm install --frozen-lockfile
# If using yarn:
# COPY yarn.lock ./
# RUN yarn install --frozen-lockfile

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner stage
FROM base AS runner
ENV NODE_ENV production
WORKDIR /app

# Create a non-root user and group
RUN addgroup -S --gid 1001 nodejs
RUN adduser -S --uid 1001 nextjs

# Copy necessary files from builder stage
# If you have a public folder, uncomment the next line
# COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Set user
USER nextjs

# Expose port
EXPOSE 3000

# Set PORT environment variable (Next.js respects this)
ENV PORT 3000

# Start the application
CMD ["npm", "start"]
