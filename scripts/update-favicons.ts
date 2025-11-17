import { PrismaClient } from "@prisma/client"
import { downloadAndSaveFavicon, updateNavigationIcon } from "../lib/favicon-downloader"

const prisma = new PrismaClient()

async function updateFavicons() {
  console.log("开始更新favicon...")

  const navigations = await prisma.navigation.findMany({
    where: {
      OR: [
        { icon: null },
        { icon: "" },
        { iconId: null }, // 也更新没有 iconId 的记录
      ],
    },
    take: 50, // 每次更新50个，避免超时
  })

  console.log(`找到 ${navigations.length} 个需要更新favicon的导航`)

  let successCount = 0
  let failCount = 0

  for (const nav of navigations) {
    try {
      console.log(`处理: ${nav.title} (${nav.url})`)
      
      // 下载并保存图标
      const iconResult = await downloadAndSaveFavicon(nav.url)
      
      if (iconResult) {
        // 更新 Navigation 记录
        await updateNavigationIcon(nav.id, iconResult)
        console.log(`✓ 更新 ${nav.title} 的favicon`)
        successCount++
      } else {
        console.log(`✗ 无法获取 ${nav.title} 的favicon`)
        failCount++
      }
    } catch (error) {
      console.error(`✗ 更新 ${nav.title} 的favicon失败:`, error)
      failCount++
    }

    // 添加延迟，避免请求过快
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  console.log("\n更新完成！")
  console.log(`成功: ${successCount} 个`)
  console.log(`失败: ${failCount} 个`)
}

updateFavicons()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
