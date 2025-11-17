import { redirect, notFound } from "next/navigation"
import { auth } from "@/auth"
import { AdminLayout } from "@/components/admin-layout"
import { NavigationForm } from "@/components/navigation-form"
import { prisma } from "@/lib/prisma"

async function getNavigation(id: string) {
  const navigation = await prisma.navigation.findUnique({
    where: { id },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })
  return navigation
}

export default async function EditNavigationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  const { id } = await params
  const navigation = await getNavigation(id)

  if (!navigation) {
    notFound()
  }

  return (
    <AdminLayout
      session={session}
      breadcrumbs={[
        { label: "管理后台", href: "/admin" },
        { label: "导航管理", href: "/admin" },
        { label: "编辑导航" },
      ]}
    >
      <NavigationForm navigation={navigation} />
    </AdminLayout>
  )
}

