import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { NavigationDataTable } from "@/components/navigation-data-table"
import { SectionCards } from "@/components/section-cards"
import { AdminLayout } from "@/components/admin-layout"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

async function getDashboardData() {
  const session = await auth()
  if (!session) {
    redirect("/admin/login")
  }

  const days = 90
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

  // 6. 最受欢迎的导航（按访问量排序）
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

  // 将 Date 转换为 string 以匹配组件类型
  const popularNavigationsWithStringDates = popularNavigations.map((nav) => ({
    ...nav,
    createdAt: nav.createdAt.toISOString(),
  }))

  return {
    stats: {
      totalNavigations,
      totalVisits,
      pendingSubmissions,
      totalUsers,
    },
    trends: {
      visits: visitTrend,
    },
    popularNavigations: popularNavigationsWithStringDates,
  }
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  const dashboardData = await getDashboardData()

  return (
    <AdminLayout
      session={session}
      breadcrumbs={[
        { label: "管理后台", href: "/admin" },
        { label: "数据看板" },
      ]}
    >
      <div className="flex flex-col gap-4 md:gap-6">
        <SectionCards stats={dashboardData.stats} />
        <ChartAreaInteractive visitTrend={dashboardData.trends.visits} />
        <NavigationDataTable navigations={dashboardData.popularNavigations} />
      </div>
    </AdminLayout>
  )
}

