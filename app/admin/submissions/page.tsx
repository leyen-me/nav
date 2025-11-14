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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">网站提交审核</h1>
          <p className="text-muted-foreground">
            审核用户提交的网站，通过后会自动添加到导航中
          </p>
        </div>
        <SubmissionManagement />
      </div>
    </AdminLayout>
  )
}

