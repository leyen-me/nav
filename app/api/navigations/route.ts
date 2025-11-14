import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get("q")
    const tag = searchParams.get("tag")
    const sortBy = searchParams.get("sortBy")

    // 构建查询条件
    let where: any = {
      status: "approved", // 只返回已审核通过的
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

    let navigations
    try {
      navigations = await prisma.navigation.findMany({
        where,
        orderBy,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      })
    } catch (error: any) {
      // 如果是因为 status 字段不存在（数据库未迁移），尝试不带 status 的查询
      if (error?.message?.includes("status") || error?.code === "P2009") {
        console.warn("Status field not found, querying without status filter. Please run database migration.")
        // 移除 status 条件，重新构建 where
        const whereWithoutStatus: any = {}
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
        navigations = await prisma.navigation.findMany({
          where: whereWithoutStatus,
          orderBy,
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
        })
      } else {
        throw error
      }
    }

    return NextResponse.json(navigations)
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
