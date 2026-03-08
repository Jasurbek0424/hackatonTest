# ──────────────────────────────────────────
# Stage 1: Dependencies
# ──────────────────────────────────────────
FROM oven/bun:1.2-alpine AS dependencies

WORKDIR /app

COPY package.json bun.lock* ./
# --frozen-lockfile гарантирует воспроизводимость
RUN bun install --frozen-lockfile

# ──────────────────────────────────────────
# Stage 2: Builder
# ──────────────────────────────────────────
FROM oven/bun:1.2-alpine AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build

# ──────────────────────────────────────────
# Stage 3: Production (самый лёгкий)
# ──────────────────────────────────────────
FROM oven/bun:1.2-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Alpine использует apk вместо apt
# Добавляем только то, что реально нужно
RUN apk add --no-cache libc6-compat

# Непривилегированный пользователь
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 usermode

COPY --from=dependencies --chown=usermode:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=usermode:nodejs /app/.next ./.next
COPY --from=builder --chown=usermode:nodejs /app/package.json ./package.json

USER usermode

EXPOSE 3000

CMD ["bun", "run", "start"] 
