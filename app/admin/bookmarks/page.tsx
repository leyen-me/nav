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
    <AdminLayout>
      <BookmarkManagement />
    </AdminLayout>
  )
}

