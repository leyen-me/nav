# 多阶段构建 Dockerfile for Next.js 应用

# ============================================
# 阶段 1: 依赖安装
# ============================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json* ./
RUN npm ci

# ============================================
# 阶段 2: 构建应用
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

# 从依赖阶段复制 node_modules
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码和配置文件
COPY . .

# 设置环境变量为生产模式
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# 生成 Prisma Client
RUN npx prisma generate

# 数据库迁移（构建时执行）
# 使用 --build-arg DATABASE_URL=xxx 传递数据库连接
ARG DATABASE_URL
RUN if [ -n "$DATABASE_URL" ]; then \
      echo "📦 执行数据库迁移..." && \
      npx prisma migrate deploy && \
      echo "✅ 迁移完成"; \
    else \
      echo "⏭️  跳过迁移（未提供 DATABASE_URL）"; \
    fi

# 构建 Next.js 应用
RUN npm run build

# ============================================
# 阶段 3: 运行环境
# ============================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要的文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# 复制 Prisma Client（运行时需要）
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
# 复制启动脚本
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh

# 设置正确的权限
RUN chmod +x ./docker-entrypoint.sh && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 使用启动脚本
ENTRYPOINT ["./docker-entrypoint.sh"]

