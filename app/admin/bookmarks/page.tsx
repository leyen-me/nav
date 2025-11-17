import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AdminLayout } from "@/components/admin-layout"
import { BookmarkManagement } from "@/components/bookmark-management"

export default async function BookmarksPage() {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout
      session={session}
      breadcrumbs={[
        { label: "管理后台", href: "/admin" },
        { label: "书签管理" },
      ]}
    >
      <BookmarkManagement />
    </AdminLayout>
  )
}

