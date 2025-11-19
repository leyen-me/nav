import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { RegisterForm } from "./register-form"

export default async function RegisterPage() {
  // 检查数据库中是否已有用户
  const userCount = await prisma.user.count()
  
  // 如果已经有用户，重定向到登录页面
  if (userCount > 0) {
    redirect("/admin/login")
  }

  return <RegisterForm />
}

