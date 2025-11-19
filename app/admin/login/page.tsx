import { redirect } from "next/navigation"
import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { LoginForm } from "./login-form"

export default async function LoginPage() {
  // 检查数据库中是否有用户
  const userCount = await prisma.user.count()
  
  // 如果没有用户，重定向到注册页面
  if (userCount === 0) {
    redirect("/admin/register")
  }

  return (
    <Suspense fallback={<div>加载中...</div>}>
      <LoginForm />
    </Suspense>
  )
}
