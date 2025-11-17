import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AdminLayout } from "@/components/admin-layout"
import { NavigationForm } from "@/components/navigation-form"

export default async function NewNavigationPage() {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout
      session={session}
      breadcrumbs={[
        { label: "管理后台", href: "/admin" },
        { label: "导航管理", href: "/admin" },
        { label: "新建导航" },
      ]}
    >
      <NavigationForm />
    </AdminLayout>
  )
}

