"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, Bookmark } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-pattern">
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-xl font-bold">
              管理后台
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/admin"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                导航管理
              </Link>
              <Link
                href="/admin/submissions"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/admin/submissions"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                提交审核
              </Link>
              <Link
                href="/admin/bookmarks"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/admin/bookmarks"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bookmark className="mr-2 h-4 w-4 inline" />
                书签管理
              </Link>
            </nav>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </Button>
        </div>
      </div>
      <div className="container px-4 py-8">{children}</div>
    </div>
  )
}

