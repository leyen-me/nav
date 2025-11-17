import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AdminLayout } from "@/components/admin-layout"
import { SubmissionManagement } from "@/components/submission-management"

export default async function SubmissionsPage() {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout
      session={session}
      breadcrumbs={[
        { label: "管理后台", href: "/admin" },
        { label: "审核管理" },
      ]}
    >
      <SubmissionManagement />
    </AdminLayout>
  )
}

