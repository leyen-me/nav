import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AdminLayout } from "@/components/admin-layout"
import { NavigationManagement } from "@/components/navigation-management"

export default async function NavigationsPage() {
  const session = await auth()

  if (!session) {
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

