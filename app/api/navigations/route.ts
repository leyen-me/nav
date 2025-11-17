import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get("q")
    const tag = searchParams.get("tag")
    const sortBy = searchParams.get("sortBy")
    // 如果传递了 page 参数，则启用分页；否则返回所有数据（用于首页）
    const pageParam = searchParams.get("page")
    const pageSizeParam = searchParams.get("pageSize")
    const usePagination = pageParam !== null || pageSizeParam !== null
    const page = pageParam ? parseInt(pageParam) : 1
    const pageSize = pageSizeParam ? parseInt(pageSizeParam) : (usePagination ? 10 : 10000)

    // 构建查询条件
    let where: any = {}
    
    // 如果不是管理员，只返回已审核通过的
    if (!session) {
      where.status = "approved"
      where.isPublic = true  // 未登录用户只能看到公开的导航
    }
    
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { shortDescription: { contains: q } },
        { description: { contains: q } },
      ]
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            name: tag,
          },
        },
      }
    }

    let orderBy: any = { createdAt: "desc" }
    if (sortBy === "visits") {
      orderBy = { visits: "desc" }
    } else if (sortBy === "created") {
      orderBy = { createdAt: "desc" }
    }

    // 获取总数
    let total
    try {
      total = await prisma.navigation.count({ where })
    } catch (error: any) {
      // 如果是因为 status 字段不存在（数据库未迁移），尝试不带 status 的查询
      if (error?.message?.includes("status") || error?.code === "P2009") {
        console.warn("Status field not found, querying without status filter. Please run database migration.")
        const whereWithoutStatus: any = {}
        // 如果不是管理员，只返回公开的
        if (!session) {
          whereWithoutStatus.isPublic = true
        }
        if (q) {
          whereWithoutStatus.OR = [
            { title: { contains: q } },
            { shortDescription: { contains: q } },
            { description: { contains: q } },
          ]
        }
        if (tag) {
          whereWithoutStatus.tags = {
            some: {
              tag: {
                name: tag,
              },
            },
          }
        }
        total = await prisma.navigation.count({ where: whereWithoutStatus })
        where = whereWithoutStatus
      } else {
        throw error
      }
    }

    // 获取分页数据
    let navigations
    try {
      const queryOptions: any = {
        where,
        orderBy,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }
      
      // 只有在启用分页时才添加 skip 和 take
      if (usePagination) {
        queryOptions.skip = (page - 1) * pageSize
        queryOptions.take = pageSize
      }
      
      navigations = await prisma.navigation.findMany(queryOptions)
    } catch (error: any) {
      // 如果是因为 status 字段不存在（数据库未迁移），尝试不带 status 的查询
      if (error?.message?.includes("status") || error?.code === "P2009") {
        console.warn("Status field not found, querying without status filter. Please run database migration.")
        // 移除 status 条件，重新构建 where
        const whereWithoutStatus: any = {}
        // 如果不是管理员，只返回公开的
        if (!session) {
          whereWithoutStatus.isPublic = true
        }
        if (q) {
          whereWithoutStatus.OR = [
            { title: { contains: q } },
            { shortDescription: { contains: q } },
            { description: { contains: q } },
          ]
        }
        if (tag) {
          whereWithoutStatus.tags = {
            some: {
              tag: {
                name: tag,
              },
            },
          }
        }
        const queryOptionsWithoutStatus: any = {
          where: whereWithoutStatus,
          orderBy,
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
        }
        
        // 只有在启用分页时才添加 skip 和 take
        if (usePagination) {
          queryOptionsWithoutStatus.skip = (page - 1) * pageSize
          queryOptionsWithoutStatus.take = pageSize
        }
        
        navigations = await prisma.navigation.findMany(queryOptionsWithoutStatus)
      } else {
        throw error
      }
    }

    // 如果启用了分页，返回分页格式；否则返回数组格式（兼容首页）
    if (usePagination) {
      return NextResponse.json({
        data: navigations,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      })
    } else {
      // 首页不需要分页，直接返回数组格式（向后兼容）
      return NextResponse.json(navigations)
    }
  } catch (error: any) {
    console.error("Error fetching navigations:", error)
    return NextResponse.json(
      { error: "Failed to fetch navigations" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { tagIds, ...data } = body

    const navigation = await prisma.navigation.create({
      data: {
        ...data,
        tags: {
          create: tagIds.map((tagId: string) => ({
            tagId,
          })),
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json(navigation)
  } catch (error) {
    console.error("Error creating navigation:", error)
    return NextResponse.json(
      { error: "Failed to create navigation" },
      { status: 500 }
    )
  }
}
