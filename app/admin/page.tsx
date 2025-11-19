import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { AdminLayout } from "@/components/admin-layout"
import { NavigationManagement } from "@/components/navigation-management"

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    // 检查数据库中是否有用户
    const userCount = await prisma.user.count()
    
    if (userCount === 0) {
      // 如果没有用户，跳转到注册页面
      redirect("/admin/register")
    }
    
    // 有用户但未登录，跳转到登录页面
    redirect("/admin/login")
  }

  return (
    <AdminLayout
      session={session}
      breadcrumbs={[
        { label: "管理后台", href: "/admin" },
        { label: "导航管理" },
      ]}
    >
      <NavigationManagement />
    </AdminLayout>
  )
}

