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
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo ""
  echo "⏳ 等待数据库就绪..."
  echo "   正在检查数据库连接..."
  # 简单的重试逻辑
  max_attempts=30
  attempt=0
  while [ $attempt -lt $max_attempts ]; do
    if npx prisma migrate status > /dev/null 2>&1 || npx prisma db push --accept-data-loss --skip-generate > /dev/null 2>&1; then
      echo "✅ 数据库连接成功 (尝试 $attempt/$max_attempts)"
      break
    fi
    attempt=$((attempt + 1))
    echo "   ⏸️  等待数据库连接... ($attempt/$max_attempts)"
    sleep 2
  done
  
  if [ $attempt -eq $max_attempts ]; then
    echo "❌ 错误: 无法连接到数据库，已达到最大重试次数 ($max_attempts)"
    exit 1
  fi
  
  echo ""
  echo "📦 运行数据库迁移..."
  echo "   执行: prisma migrate deploy"
  if npx prisma migrate deploy 2>&1; then
    echo "✅ 数据库迁移完成 (使用 migrate deploy)"
  else
    echo "   ⚠️  migrate deploy 失败，尝试使用 db push..."
    npx prisma db push --accept-data-loss --skip-generate
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

