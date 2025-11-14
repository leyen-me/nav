"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-pattern">
      <div className="border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link 
              href="/admin" 
              className="text-xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
            >
              管理后台
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/admin"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === "/admin"
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                导航管理
              </Link>
              <Link
                href="/admin/submissions"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === "/admin/submissions"
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                审核管理
              </Link>
              <Link
                href="/admin/bookmarks"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === "/admin/bookmarks"
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                书签管理
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              退出登录
            </Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  )
}

