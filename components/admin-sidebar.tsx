"use client"

import * as React from "react"
import {
  IconLayoutDashboard,
  IconBookmark,
  IconFileCheck,
  IconHome,
  IconList,
} from "@tabler/icons-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

// ==================== 配置区域 ====================
// 控制"回到前台"按钮的位置
// "top" - 方案一：在侧边栏内容区顶部（更突出）
// "footer" - 方案二：在侧边栏底部，用户信息上方（不干扰主功能）
const HOME_BUTTON_POSITION: "top" | "footer" = "footer"
// ==================================================

export function AdminSidebar({ 
  user,
  ...props 
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string
    email: string
    avatar?: string
  }
}) {
  const pathname = usePathname()
  
  const navItems = [
    {
      title: "数据看板",
      url: "/admin/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      title: "导航管理",
      url: "/admin/navigations",
      icon: IconList,
    },
    {
      title: "审核管理",
      url: "/admin/submissions",
      icon: IconFileCheck,
    },
    {
      title: "书签管理",
      url: "/admin/bookmarks",
      icon: IconBookmark,
    },
  ]

  // 回到前台按钮组件
  const HomeButton = () => (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild
        tooltip="回到前台"
        className={HOME_BUTTON_POSITION === "top" ? "bg-primary/10 hover:bg-primary/20" : ""}
      >
        <Link href="/">
          <IconHome />
          <span>回到前台</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:!p-2"
            >
              <Link href="/admin">
                <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
                  <IconLayoutDashboard className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">管理后台</span>
                  <span className="text-muted-foreground truncate text-xs">
                    Navigation Admin
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* 方案一：回到前台按钮在顶部 */}
        {HOME_BUTTON_POSITION === "top" && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <HomeButton />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        {/* 主要管理功能 */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    tooltip={item.title}
                    isActive={
                      pathname === item.url || 
                      (item.url === "/admin/navigations" && pathname.startsWith("/admin/navigations"))
                    }
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* 方案二：回到前台按钮在底部，用户信息上方 */}
        {HOME_BUTTON_POSITION === "footer" && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <HomeButton />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <NavUser user={{ ...user, avatar: user.avatar || "" }} />
      </SidebarFooter>
    </Sidebar>
  )
}

