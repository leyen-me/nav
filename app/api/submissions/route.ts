import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

// 用户提交网站
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, url, description } = body

    if (!title || !url) {
      return NextResponse.json(
        { error: "标题和URL是必填项" },
        { status: 400 }
      )
    }

    const submission = await prisma.submission.create({
      data: {
        title,
        url,
        description: description || null,
        status: "pending",
      },
    })

    return NextResponse.json(submission)
  } catch (error) {
    console.error("Error creating submission:", error)
    return NextResponse.json(
      { error: "提交失败，请稍后重试" },
      { status: 500 }
    )
  }
}

// 管理员获取所有提交（需要认证）
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")

    const where: any = {}
    if (status) {
      where.status = status
    }

    const submissions = await prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error("Error fetching submissions:", error)
    return NextResponse.json(
      { error: "获取提交列表失败" },
      { status: 500 }
    )
  }
}

