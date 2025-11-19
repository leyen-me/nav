import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get("days") || "90")

    // 计算日期范围
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // 1. 总导航数量（已审核通过）
    const totalNavigations = await prisma.navigation.count({
      where: {
        status: "approved",
      },
    })

    // 2. 总访问量
    const totalVisitsResult = await prisma.navigation.aggregate({
      where: {
        status: "approved",
      },
      _sum: {
        visits: true,
      },
    })
    const totalVisits = totalVisitsResult._sum.visits || 0

    // 3. 待审核提交数量
    const pendingSubmissions = await prisma.submission.count({
      where: {
        status: "pending",
      },
    })

    // 4. 总用户数
    const totalUsers = await prisma.user.count()

    // 5. 访问量趋势（按日期统计）
    // 由于 Navigation 表没有访问记录的时间戳，我们使用创建时间作为参考
    // 实际项目中可能需要一个单独的访问记录表
    const navigations = await prisma.navigation.findMany({
      where: {
        status: "approved",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
        visits: true,
      },
    })

    // 按日期分组统计访问量
    const visitsByDate: Record<string, number> = {}
    navigations.forEach((nav) => {
      const date = nav.createdAt.toISOString().split("T")[0]
      visitsByDate[date] = (visitsByDate[date] || 0) + nav.visits
    })

    // 生成完整的日期序列
    const visitTrend = []
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0]
      visitTrend.push({
        date: dateStr,
        visits: visitsByDate[dateStr] || 0,
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // 6. 导航创建趋势（按日期统计）
    const creationTrend = []
    const creationByDate: Record<string, number> = {}
    navigations.forEach((nav) => {
      const date = nav.createdAt.toISOString().split("T")[0]
      creationByDate[date] = (creationByDate[date] || 0) + 1
    })

    const currentDate2 = new Date(startDate)
    while (currentDate2 <= endDate) {
      const dateStr = currentDate2.toISOString().split("T")[0]
      creationTrend.push({
        date: dateStr,
        count: creationByDate[dateStr] || 0,
      })
      currentDate2.setDate(currentDate2.getDate() + 1)
    }

    // 7. 提交审核趋势
    const submissions = await prisma.submission.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
        status: true,
      },
    })

    const submissionTrend = []
    const submissionByDate: Record<string, { pending: number; approved: number; rejected: number }> = {}
    submissions.forEach((sub) => {
      const date = sub.createdAt.toISOString().split("T")[0]
      if (!submissionByDate[date]) {
        submissionByDate[date] = { pending: 0, approved: 0, rejected: 0 }
      }
      if (sub.status === "pending") {
        submissionByDate[date].pending++
      } else if (sub.status === "approved") {
        submissionByDate[date].approved++
      } else if (sub.status === "rejected") {
        submissionByDate[date].rejected++
      }
    })

    const currentDate3 = new Date(startDate)
    while (currentDate3 <= endDate) {
      const dateStr = currentDate3.toISOString().split("T")[0]
      submissionTrend.push({
        date: dateStr,
        pending: submissionByDate[dateStr]?.pending || 0,
        approved: submissionByDate[dateStr]?.approved || 0,
        rejected: submissionByDate[dateStr]?.rejected || 0,
      })
      currentDate3.setDate(currentDate3.getDate() + 1)
    }

    // 8. 最受欢迎的导航（按访问量排序）
    const popularNavigations = await prisma.navigation.findMany({
      where: {
        status: "approved",
      },
      orderBy: {
        visits: "desc",
      },
      take: 10,
      select: {
        id: true,
        title: true,
        url: true,
        visits: true,
        createdAt: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // 9. 标签分布统计
    const tagStats = await prisma.tag.findMany({
      include: {
        navigations: {
          where: {
            navigation: {
              status: "approved",
            },
          },
          select: {
            navigationId: true,
          },
        },
      },
    })

    const tagDistribution = tagStats.map((tag) => ({
      name: tag.name,
      count: tag.navigations.length,
    })).sort((a, b) => b.count - a.count)

    return NextResponse.json({
      stats: {
        totalNavigations,
        totalVisits,
        pendingSubmissions,
        totalUsers,
      },
      trends: {
        visits: visitTrend,
        creations: creationTrend,
        submissions: submissionTrend,
      },
      popularNavigations,
      tagDistribution,
    })
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}

