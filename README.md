# NAV - 导航网站

一个简约现代的导航网站，使用 Next.js、Tailwind CSS、TypeScript 和 Prisma 构建。

## 功能特性

- 🎨 简约科技风设计，无圆角
- 🌓 浅色/深色主题切换
- 🔍 实时搜索和筛选
- 🏷️ 标签分类管理
- 📊 访问量统计
- 🔐 管理员后台
- 📥 Chrome 书签导入
- ⚡ GSAP 动画效果
- 📱 响应式布局

## 技术栈

- **框架**: Next.js 16
- **样式**: Tailwind CSS 4
- **语言**: TypeScript
- **UI组件**: Shadcn UI
- **图标**: Lucide Icons
- **动画**: GSAP
- **认证**: NextAuth.js
- **数据库**: MySQL + Prisma ORM
- **部署**: Docker + Docker Compose

## 开始使用

### 方式一：Docker 部署（推荐）

使用 Docker Compose 一键部署，包含数据库和应用：

```bash
# 1. 创建 .env 文件（参考上面的 Docker 部署章节）
# 2. 启动服务
docker-compose up -d

# 3. 访问管理后台进行首次注册
# 系统会自动检测是否已有用户，如果没有用户会跳转到注册页面
```

访问 [http://localhost:3000](http://localhost:3000)，首次访问管理后台时会自动跳转到注册页面创建管理员账户。

### 方式二：本地开发

#### 1. 安装依赖

```bash
npm install
```

#### 2. 配置环境变量

创建 `.env` 文件：

```env
DATABASE_URL="mysql://root:password@localhost:3306/nav"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
CRON_SECRET="your-cron-secret-key"
```

#### 3. 初始化数据库

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库架构
npm run db:push
```

#### 4. 创建管理员账户

启动应用后，访问 `/admin` 路由，系统会自动检测数据库中是否有用户。如果没有用户，会自动跳转到注册页面，您可以创建第一个管理员账户。

#### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
nav/
├── app/                    # Next.js App Router
│   ├── admin/              # 管理员后台
│   ├── api/                # API 路由
│   ├── navigation/         # 导航详情页
│   └── page.tsx            # 首页
├── components/             # React 组件
│   ├── ui/                 # Shadcn UI 组件
│   └── ...                 # 业务组件
├── lib/                    # 工具函数
├── prisma/                 # Prisma 配置
├── scripts/                # 脚本文件
└── hooks/                  # React Hooks
```

## 数据库模型

### Navigation (导航数据)
- id: 唯一标识
- title: 网站名称（必填）
- shortDescription: 简短描述
- description: 详细介绍（富文本）
- url: 网站地址（必填）
- icon: 图标URL
- visits: 访问量
- createdAt: 创建时间
- updatedAt: 更新时间

### Tag (标签)
- id: 唯一标识
- name: 标签名称（唯一）
- createdAt: 创建时间
- updatedAt: 更新时间

### User (用户)
- id: 唯一标识
- email: 邮箱（唯一）
- password: 密码（加密）
- name: 名称
- createdAt: 创建时间
- updatedAt: 更新时间

## 定时任务

### 更新 Favicon

可以通过以下方式更新网站的 favicon：

1. **手动执行脚本**:
```bash
npm run update-favicons
```

2. **API 端点** (需要认证):
```bash
curl -H "Authorization: Bearer your-cron-secret" http://localhost:3000/api/cron/update-favicons
```

3. **使用 cron 服务** (如 Vercel Cron):
配置 cron job 定期调用 API 端点

## 开发命令

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 数据库相关
npm run db:push          # 推送数据库架构
npm run db:migrate        # 创建迁移
npm run db:generate       # 生成 Prisma 客户端
npm run db:studio         # 打开 Prisma Studio

# 工具脚本
npm run update-favicons   # 更新 favicon
```

## 部署

### Docker 部署（推荐）

使用 Docker Compose 可以快速部署整个应用，包括数据库。

#### 前置要求

- Docker 20.10+
- Docker Compose 2.0+

#### 快速开始

1. **创建环境变量文件**

创建 `.env` 文件：

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

# 自动运行数据库迁移（可选）
RUN_MIGRATIONS=true
```

2. **启动服务**

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f app
```

3. **初始化数据库**

如果 `RUN_MIGRATIONS=false`，需要手动运行：

```bash
# 运行数据库迁移
docker-compose exec app npx prisma migrate deploy
# 或使用 db push（开发环境）
docker-compose exec app npx prisma db push
```

4. **创建管理员账户**

访问 `http://localhost:3000/admin`，系统会自动检测数据库中是否有用户。如果没有用户，会自动跳转到注册页面，您可以创建第一个管理员账户。

5. **访问应用**

应用将在 `http://localhost:3000` 上运行。

#### 常用命令

```bash
# 停止所有服务
docker-compose down

# 停止并删除数据卷（会删除数据库数据）
docker-compose down -v

# 重新构建镜像
docker-compose build --no-cache

# 查看应用日志
docker-compose logs -f app

# 进入应用容器
docker-compose exec app sh

# 进入数据库容器
docker-compose exec db mysql -u navuser -p nav
```

更多 Docker 部署详情请参考 [DOCKER.md](./DOCKER.md)

### 传统部署

1. 确保数据库已配置并运行
2. 设置环境变量
3. 运行数据库迁移: `npm run db:push`
4. 构建项目: `npm run build`
5. 启动服务: `npm start`
6. 访问 `/admin` 路由创建第一个管理员账户（如果数据库中没有用户，会自动跳转到注册页面）

## 许可证

MIT
