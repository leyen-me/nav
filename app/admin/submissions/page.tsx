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
    <AdminLayout>
      <SubmissionManagement />
    </AdminLayout>
  )
}

