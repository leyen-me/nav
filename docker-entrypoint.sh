#!/bin/sh
set -e

echo "🚀 启动应用..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 输出环境变量信息
echo "📋 环境变量信息:"
if [ -n "$DATABASE_URL" ]; then
  echo "   DATABASE_URL: $DATABASE_URL"
else
  echo "   DATABASE_URL: (未设置)"
fi
if [ -n "$RUN_MIGRATIONS" ]; then
  echo "   RUN_MIGRATIONS: $RUN_MIGRATIONS"
else
  echo "   RUN_MIGRATIONS: (未设置，将跳过迁移)"
fi
if [ -n "$NODE_ENV" ]; then
  echo "   NODE_ENV: $NODE_ENV"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 运行数据库迁移（如果需要）
# 注意：由于 docker-compose.yml 中已配置 depends_on 和健康检查，
# 数据库服务在应用启动前应该已经就绪，因此直接运行迁移即可
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo ""
  echo "📦 运行数据库迁移..."
  echo "   执行: prisma migrate deploy"
  # 使用 node_modules/.bin/prisma 确保能找到 Prisma CLI
  if ./node_modules/.bin/prisma migrate deploy 2>&1; then
    echo "✅ 数据库迁移完成 (使用 migrate deploy)"
  else
    echo "   ⚠️  migrate deploy 失败，尝试使用 db push..."
    ./node_modules/.bin/prisma db push --accept-data-loss --skip-generate
    echo "✅ 数据库迁移完成 (使用 db push)"
  fi
else
  echo ""
  echo "⏭️  跳过数据库迁移 (RUN_MIGRATIONS != true)"
fi

# 启动应用
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 启动 Next.js 应用..."
echo "   执行: node server.js"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
exec node server.js

