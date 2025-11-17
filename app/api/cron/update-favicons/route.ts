import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { downloadAndSaveFavicon, updateNavigationIcon } from "@/lib/favicon-downloader"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
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

    const results = []
    for (const nav of navigations) {
      try {
        console.log(`处理: ${nav.title} (${nav.url})`)
        
        // 下载并保存图标
        const iconResult = await downloadAndSaveFavicon(nav.url)
        
        if (iconResult) {
          // 更新 Navigation 记录
          await updateNavigationIcon(nav.id, iconResult)
          results.push({ 
            id: nav.id, 
            title: nav.title, 
            success: true,
            iconUrl: iconResult.iconUrl,
          })
          console.log(`✓ 更新 ${nav.title} 的favicon`)
        } else {
          results.push({ 
            id: nav.id, 
            title: nav.title, 
            success: false,
            error: "Failed to download icon",
          })
          console.log(`✗ 无法获取 ${nav.title} 的favicon`)
        }
      } catch (error) {
        console.error(`✗ 更新 ${nav.title} 的favicon失败:`, error)
        results.push({ 
          id: nav.id, 
          title: nav.title, 
          success: false, 
          error: String(error),
        })
      }

      // 添加延迟，避免请求过快
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    console.log("favicon更新完成")

    return NextResponse.json({
      success: true,
      total: navigations.length,
      updated: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    })
  } catch (error) {
    console.error("更新favicon失败:", error)
    return NextResponse.json(
      { error: "更新失败", details: String(error) },
      { status: 500 }
    )
  }
}
