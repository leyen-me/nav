import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "未授权" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { name, email } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: "请填写所有字段" },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "邮箱格式不正确" },
        { status: 400 }
      )
    }

    // 获取当前用户
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      )
    }

    // 如果邮箱有变化，检查新邮箱是否已被使用
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser && existingUser.id !== currentUser.id) {
        return NextResponse.json(
          { error: "该邮箱已被使用" },
          { status: 400 }
        )
      }
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name,
        email,
      },
    })

    return NextResponse.json({
      success: true,
      message: "用户信息修改成功",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
      },
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "修改用户信息失败" },
      { status: 500 }
    )
  }
}

