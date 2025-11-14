import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// 示例网站数据
const sampleWebsites = [
  {
    title: "GitHub",
    url: "https://github.com",
    shortDescription: "代码托管和协作平台",
    description: "全球最大的代码托管平台，支持 Git 版本控制，提供代码审查、项目管理等功能。",
    tags: ["开发", "工具", "代码"],
  },
  {
    title: "Vercel",
    url: "https://vercel.com",
    shortDescription: "前端部署平台",
    description: "现代化的前端部署平台，支持 Next.js、React 等框架的快速部署。",
    tags: ["开发", "部署", "前端"],
  },
  {
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    shortDescription: "Web 开发文档",
    description: "Mozilla 提供的权威 Web 开发文档，包含 HTML、CSS、JavaScript 等技术的详细说明。",
    tags: ["学习", "文档", "前端"],
  },
  {
    title: "Stack Overflow",
    url: "https://stackoverflow.com",
    shortDescription: "程序员问答社区",
    description: "全球最大的程序员问答社区，可以找到各种编程问题的解决方案。",
    tags: ["学习", "问答", "开发"],
  },
  {
    title: "Figma",
    url: "https://figma.com",
    shortDescription: "在线设计工具",
    description: "强大的在线 UI/UX 设计工具，支持团队协作和原型设计。",
    tags: ["设计", "工具", "UI"],
  },
  {
    title: "Notion",
    url: "https://notion.so",
    shortDescription: "笔记和项目管理工具",
    description: "全能的笔记和项目管理工具，支持文档、数据库、看板等多种视图。",
    tags: ["工具", "笔记", "管理"],
  },
  {
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    shortDescription: "实用优先的 CSS 框架",
    description: "快速构建现代网站的实用优先 CSS 框架，提供丰富的工具类。",
    tags: ["前端", "CSS", "框架"],
  },
  {
    title: "TypeScript",
    url: "https://www.typescriptlang.org",
    shortDescription: "JavaScript 的超集",
    description: "微软开发的 JavaScript 超集，添加了静态类型检查功能。",
    tags: ["开发", "语言", "前端"],
  },
  {
    title: "React",
    url: "https://react.dev",
    shortDescription: "用于构建用户界面的 JavaScript 库",
    description: "Facebook 开发的用于构建用户界面的 JavaScript 库，采用组件化开发模式。",
    tags: ["前端", "框架", "React"],
  },
  {
    title: "Next.js",
    url: "https://nextjs.org",
    shortDescription: "React 全栈框架",
    description: "基于 React 的全栈框架，提供 SSR、SSG、API 路由等功能。",
    tags: ["前端", "框架", "React"],
  },
  {
    title: "Vue.js",
    url: "https://vuejs.org",
    shortDescription: "渐进式 JavaScript 框架",
    description: "用于构建用户界面的渐进式 JavaScript 框架，易于学习和使用。",
    tags: ["前端", "框架", "Vue"],
  },
  {
    title: "Node.js",
    url: "https://nodejs.org",
    shortDescription: "JavaScript 运行时",
    description: "基于 Chrome V8 引擎的 JavaScript 运行时，可以在服务器端运行 JavaScript。",
    tags: ["后端", "开发", "Node"],
  },
  {
    title: "PostgreSQL",
    url: "https://www.postgresql.org",
    shortDescription: "开源关系型数据库",
    description: "功能强大的开源对象关系数据库系统，支持 SQL 标准。",
    tags: ["数据库", "后端", "工具"],
  },
  {
    title: "MongoDB",
    url: "https://www.mongodb.com",
    shortDescription: "NoSQL 数据库",
    description: "流行的 NoSQL 文档数据库，适合存储非结构化数据。",
    tags: ["数据库", "后端", "工具"],
  },
  {
    title: "Redis",
    url: "https://redis.io",
    shortDescription: "内存数据结构存储",
    description: "开源的内存数据结构存储系统，可用作数据库、缓存和消息代理。",
    tags: ["数据库", "缓存", "工具"],
  },
  {
    title: "Docker",
    url: "https://www.docker.com",
    shortDescription: "容器化平台",
    description: "开源的容器化平台，可以打包应用及其依赖项到轻量级容器中。",
    tags: ["工具", "部署", "DevOps"],
  },
  {
    title: "Kubernetes",
    url: "https://kubernetes.io",
    shortDescription: "容器编排平台",
    description: "开源的容器编排平台，用于自动化部署、扩展和管理容器化应用。",
    tags: ["工具", "部署", "DevOps"],
  },
  {
    title: "AWS",
    url: "https://aws.amazon.com",
    shortDescription: "亚马逊云服务",
    description: "全球领先的云计算平台，提供计算、存储、数据库等多种服务。",
    tags: ["云服务", "部署", "工具"],
  },
  {
    title: "Google Cloud",
    url: "https://cloud.google.com",
    shortDescription: "谷歌云平台",
    description: "Google 提供的云计算服务，包括计算、存储、机器学习等服务。",
    tags: ["云服务", "部署", "工具"],
  },
  {
    title: "Vite",
    url: "https://vitejs.dev",
    shortDescription: "下一代前端构建工具",
    description: "快速的构建工具，提供极速的开发服务器和优化的生产构建。",
    tags: ["工具", "构建", "前端"],
  },
  {
    title: "Webpack",
    url: "https://webpack.js.org",
    shortDescription: "模块打包器",
    description: "强大的模块打包器，可以将多个模块打包成一个或多个 bundle。",
    tags: ["工具", "构建", "前端"],
  },
  {
    title: "ESLint",
    url: "https://eslint.org",
    shortDescription: "JavaScript 代码检查工具",
    description: "可插拔的 JavaScript 代码检查工具，帮助发现和修复代码问题。",
    tags: ["工具", "代码质量", "开发"],
  },
  {
    title: "Prettier",
    url: "https://prettier.io",
    shortDescription: "代码格式化工具",
    description: "支持多种语言的代码格式化工具，可以自动统一代码风格。",
    tags: ["工具", "代码质量", "开发"],
  },
  {
    title: "Jest",
    url: "https://jestjs.io",
    shortDescription: "JavaScript 测试框架",
    description: "流行的 JavaScript 测试框架，提供完整的测试解决方案。",
    tags: ["工具", "测试", "开发"],
  },
  {
    title: "Cypress",
    url: "https://www.cypress.io",
    shortDescription: "端到端测试框架",
    description: "现代化的端到端测试框架，提供强大的测试工具和调试功能。",
    tags: ["工具", "测试", "开发"],
  },
  {
    title: "Storybook",
    url: "https://storybook.js.org",
    shortDescription: "UI 组件开发工具",
    description: "用于独立开发 UI 组件的工具，可以在隔离环境中开发和测试组件。",
    tags: ["工具", "开发", "前端"],
  },
  {
    title: "Can I Use",
    url: "https://caniuse.com",
    shortDescription: "浏览器兼容性查询",
    description: "查询 Web 技术在各个浏览器中的支持情况。",
    tags: ["工具", "前端", "参考"],
  },
  {
    title: "CSS-Tricks",
    url: "https://css-tricks.com",
    shortDescription: "CSS 技巧和教程",
    description: "提供 CSS 技巧、教程和最佳实践的网站。",
    tags: ["学习", "CSS", "前端"],
  },
  {
    title: "Smashing Magazine",
    url: "https://www.smashingmagazine.com",
    shortDescription: "Web 设计和开发杂志",
    description: "专注于 Web 设计和开发的在线杂志，提供高质量的文章和教程。",
    tags: ["学习", "设计", "前端"],
  },
  {
    title: "A List Apart",
    url: "https://alistapart.com",
    shortDescription: "Web 标准和最佳实践",
    description: "专注于 Web 标准和最佳实践的在线杂志。",
    tags: ["学习", "标准", "前端"],
  },
]

async function initData() {
  console.log("开始初始化测试数据...")

  try {
    // 1. 创建标签
    const tagMap = new Map<string, string>()
    const allTags = new Set<string>()

    // 收集所有标签
    sampleWebsites.forEach((site) => {
      site.tags.forEach((tag) => allTags.add(tag))
    })

    console.log(`创建 ${allTags.size} 个标签...`)
    for (const tagName of allTags) {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      })
      tagMap.set(tagName, tag.id)
      console.log(`✓ 创建标签: ${tagName}`)
    }

    // 2. 创建网站
    console.log(`\n创建 ${sampleWebsites.length} 个网站...`)
    let created = 0
    let skipped = 0

    for (const site of sampleWebsites) {
      try {
        // 检查是否已存在
        const existing = await prisma.navigation.findFirst({
          where: { url: site.url },
        })

        if (existing) {
          console.log(`⊘ 跳过已存在的网站: ${site.title}`)
          skipped++
          continue
        }

        // 创建网站
        const navigation = await prisma.navigation.create({
          data: {
            title: site.title,
            url: site.url,
            shortDescription: site.shortDescription,
            description: site.description,
            icon: `https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}&sz=64`,
            visits: Math.floor(Math.random() * 1000), // 随机访问量
            tags: {
              create: site.tags.map((tagName) => ({
                tagId: tagMap.get(tagName)!,
              })),
            },
          },
        })

        console.log(`✓ 创建网站: ${site.title}`)
        created++
      } catch (error) {
        console.error(`✗ 创建网站失败 ${site.title}:`, error)
      }
    }

    console.log(`\n完成！`)
    console.log(`- 创建标签: ${allTags.size} 个`)
    console.log(`- 创建网站: ${created} 个`)
    console.log(`- 跳过网站: ${skipped} 个`)
  } catch (error) {
    console.error("初始化数据失败:", error)
    throw error
  }
}

initData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

