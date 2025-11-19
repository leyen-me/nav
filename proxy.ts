import { auth } from "./auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isLoginRoute = nextUrl.pathname.startsWith("/admin/login")
  const isRegisterRoute = nextUrl.pathname.startsWith("/admin/register")

  // 如果访问其他 admin 路由但未登录，重定向到登录页面
  // 用户检查逻辑在页面组件中处理（admin/page.tsx 会检查并重定向到注册页面）
  if (isAdminRoute && !isLoginRoute && !isRegisterRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", nextUrl))
  }

  // 如果已登录，访问登录或注册页面时重定向到管理后台
  if ((isLoginRoute || isRegisterRoute) && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

