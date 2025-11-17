"use client"

import type { Session } from "next-auth"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminSiteHeader } from "@/components/admin-site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
  session: Session | null
  title?: string
  breadcrumbs?: {
    label: string
    href?: string
  }[]
}

export function AdminLayout({ children, session, title, breadcrumbs }: AdminLayoutProps) {
  const user = {
    name: session?.user?.name || "管理员",
    email: session?.user?.email || "admin@example.com",
    avatar: session?.user?.image || "/avatars/default.jpg",
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar user={user} />
      <SidebarInset>
        <AdminSiteHeader title={title} breadcrumbs={breadcrumbs} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

