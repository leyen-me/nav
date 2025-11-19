# Docker 部署指南

本文档说明如何使用 Docker 部署此 Next.js 应用。

## 前置要求

- Docker 20.10+
- Docker Compose 2.0+

## 快速开始

### 1. 创建环境变量文件

创建 `.env` 文件（参考以下配置）：

```env
# 数据库配置
DATABASE_URL="mysql://navuser:navpassword@db:3306/nav"
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=nav
MYSQL_USER=navuser
MYSQL_PASSWORD=navpassword
DB_PORT=3306

# Next.js 应用配置
APP_PORT=3000
NODE_ENV=production

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-in-production
```

**重要**: 在生产环境中，请务必修改 `NEXTAUTH_SECRET` 和其他敏感信息。

### 2. 构建并启动服务

```bash
# 构建镜像并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f app

# 查看所有服务状态
docker-compose ps
```

### 3. 初始化数据库

应用启动后，需要运行数据库迁移：

```bash
# 进入应用容器
docker-compose exec app sh

# 在容器内运行数据库迁移
npx prisma migrate deploy

# 或者如果需要推送 schema（开发环境）
npx prisma db push

# 生成 Prisma Client（如果需要）
npx prisma generate

# 初始化数据（如果需要）
npm run init-data
```

### 4. 创建管理员账户

访问 `http://localhost:3000/admin`（或你配置的端口），系统会自动检测数据库中是否有用户。如果没有用户，会自动跳转到注册页面，您可以创建第一个管理员账户。

### 5. 访问应用

应用将在 `http://localhost:3000` 上运行（或你配置的端口）。

## 单独使用 Dockerfile

如果不想使用 docker-compose，可以单独构建和运行：

### 构建镜像

```bash
docker build -t nav-app .
```

### 运行容器

```bash
docker run -d \
  --name nav-app \
  -p 3000:3000 \
  -e DATABASE_URL="mysql://user:password@host:3306/database" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e NEXTAUTH_SECRET="your-secret-key" \
  nav-app
```

## 生产环境部署建议

1. **使用环境变量文件**: 使用 `--env-file` 选项加载环境变量
2. **配置反向代理**: 使用 Nginx 或 Traefik 作为反向代理
3. **启用 HTTPS**: 配置 SSL 证书
4. **数据库备份**: 定期备份 MySQL 数据卷
5. **监控和日志**: 配置日志收集和监控系统
6. **资源限制**: 在 docker-compose.yml 中添加资源限制

## 常用命令

```bash
# 停止所有服务
docker-compose down

# 停止并删除数据卷（注意：会删除数据库数据）
docker-compose down -v

# 重新构建镜像
docker-compose build --no-cache

# 查看应用日志
docker-compose logs -f app

# 查看数据库日志
docker-compose logs -f db

# 进入应用容器
docker-compose exec app sh

# 进入数据库容器
docker-compose exec db mysql -u navuser -p nav
```

## 故障排查

### 应用无法连接数据库

1. 检查数据库服务是否健康：`docker-compose ps`
2. 检查 DATABASE_URL 环境变量是否正确
3. 检查网络连接：`docker-compose exec app ping db`

### 构建失败

1. 清理 Docker 缓存：`docker system prune -a`
2. 检查 Dockerfile 中的路径是否正确
3. 确保所有必要的文件都在 `.dockerignore` 中正确排除

### 权限问题

如果遇到权限问题，确保：
- Dockerfile 中正确设置了用户权限
- 数据卷的挂载路径有正确的权限

## 更新应用

```bash
# 拉取最新代码
git pull

# 重新构建并重启
docker-compose up -d --build

# 运行数据库迁移（如果需要）
docker-compose exec app npx prisma migrate deploy
```

