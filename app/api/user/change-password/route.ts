import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

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
    const { newPassword } = body

    if (!newPassword) {
      return NextResponse.json(
        { error: "请填写新密码" },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "新密码长度至少为 6 位" },
        { status: 400 }
      )
    }

    // 获取当前用户
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      )
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 更新密码
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ success: true, message: "密码修改成功" })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json(
      { error: "修改密码失败" },
      { status: 500 }
    )
  }
}

