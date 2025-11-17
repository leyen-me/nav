import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 从数据库查询图标
    const icon = await prisma.icon.findUnique({
      where: { id },
      select: {
        data: true,
        mimeType: true,
      },
    })

    if (!icon) {
      return NextResponse.json({ error: "Icon not found" }, { status: 404 })
    }

    // 返回图标二进制数据
    return new NextResponse(icon.data, {
      status: 200,
      headers: {
        "Content-Type": icon.mimeType,
        // 添加缓存控制头，缓存 7 天
        "Cache-Control": "public, max-age=604800, immutable",
        // 允许跨域
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Error fetching icon:", error)
    return NextResponse.json(
      { error: "Failed to fetch icon" },
      { status: 500 }
    )
  }
}

