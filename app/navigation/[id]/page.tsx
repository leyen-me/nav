import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NavigationDetail } from "@/components/navigation-detail"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

async function getNavigation(id: string) {
  const session = await auth()
  
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

  if (!navigation) {
    return null
  }

  // 如果未登录且导航是私有的，返回null（会触发notFound）
  if (!session && !navigation.isPublic) {
    return null
  }

  // 增加访问量
  await prisma.navigation.update({
    where: { id },
    data: { visits: { increment: 1 } },
  })

  return navigation
}

export default async function NavigationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const navigation = await getNavigation(id)

  if (!navigation) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-8 mx-auto max-w-7xl relative z-10">
        <NavigationDetail navigation={navigation} />
      </main>
      <Footer />
    </div>
  )
}

