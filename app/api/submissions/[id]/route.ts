import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

// 审核提交
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { status } = body

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "无效的状态" },
        { status: 400 }
      )
    }

    const { id } = await params
    const submission = await prisma.submission.findUnique({
      where: { id },
    })

    if (!submission) {
      return NextResponse.json(
        { error: "提交不存在" },
        { status: 404 }
      )
    }

    // 如果审核通过，创建导航项
    if (status === "approved") {
      await prisma.navigation.create({
        data: {
          title: submission.title,
          url: submission.url,
          description: submission.description,
          shortDescription: submission.description
            ? submission.description.substring(0, 100)
            : null,
          status: "approved",
        },
      })
    }

    // 更新提交状态
    const updatedSubmission = await prisma.submission.update({
      where: { id },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy: session.user?.email || null,
      },
    })

    return NextResponse.json(updatedSubmission)
  } catch (error) {
    console.error("Error reviewing submission:", error)
    return NextResponse.json(
      { error: "审核失败" },
      { status: 500 }
    )
  }
}

// 删除提交
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.submission.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting submission:", error)
    return NextResponse.json(
      { error: "删除失败" },
      { status: 500 }
    )
  }
}

