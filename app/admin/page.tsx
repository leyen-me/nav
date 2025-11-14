import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AdminLayout } from "@/components/admin-layout"
import { NavigationManagement } from "@/components/navigation-management"

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout>
      <NavigationManagement />
    </AdminLayout>
  )
}

