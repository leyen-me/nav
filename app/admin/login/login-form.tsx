"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  // 检查是否有注册成功的提示
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("注册成功！请使用您的账号密码登录")
      // 清除 URL 参数
      router.replace("/admin/login", { scroll: false })
    }
  }, [searchParams, router])

  // 从 localStorage 加载保存的账号密码
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("remembered_email")
      const savedPassword = localStorage.getItem("remembered_password")
      const savedRememberMe = localStorage.getItem("remember_me") === "true"

      if (savedRememberMe && savedEmail && savedPassword) {
        setEmail(savedEmail)
        setPassword(savedPassword)
        setRememberMe(true)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("邮箱或密码错误")
      } else {
        // 根据记住密码选项保存或清除账号密码
        if (rememberMe) {
          localStorage.setItem("remembered_email", email)
          localStorage.setItem("remembered_password", password)
          localStorage.setItem("remember_me", "true")
        } else {
          localStorage.removeItem("remembered_email")
          localStorage.removeItem("remembered_password")
          localStorage.removeItem("remember_me")
        }

        router.push("/admin")
        router.refresh()
      }
    } catch (err) {
      setError("登录失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-pattern p-4 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className={cn("flex flex-col gap-6 w-full max-w-5xl relative z-10")}>
        <Card className="overflow-hidden p-0 shadow-2xl border-0 md:h-[600px] flex">
          <CardContent className="grid p-0 md:grid-cols-2 flex-1">
            <form className="p-8 md:p-10 lg:p-12 flex flex-col justify-center" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center mb-2">
                  <h1 className="text-3xl font-bold">欢迎回来</h1>
                  <p className="text-muted-foreground text-balance">
                    登录到您的管理员账户
                  </p>
                </div>

                {success && (
                  <div className="text-sm text-green-600 dark:text-green-400 text-center bg-green-50 dark:bg-green-950/30 p-3 rounded-md border border-green-200 dark:border-green-800">
                    {success}
                  </div>
                )}

                {error && (
                  <div className="text-sm text-destructive text-center bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="email">邮箱</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">密码</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </Field>

                <Field>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked === true)
                      }
                    />
                    <FieldLabel
                      htmlFor="remember"
                      className="font-normal cursor-pointer"
                    >
                      记住账号密码
                    </FieldLabel>
                  </div>
                </Field>

                <Field>
                  <Button type="submit" className="w-full h-11" disabled={loading}>
                    {loading ? "登录中..." : "登录"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>

            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 relative hidden md:block overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative z-10 text-center">
                  <div className="mb-6">
                    <svg
                      width="120"
                      height="120"
                      viewBox="0 0 120 120"
                      className="mx-auto"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary/20"
                      />
                      <path
                        d="M60 30 L60 60 L80 70"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="text-primary/40"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="4"
                        fill="currentColor"
                        className="text-primary/40"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2 text-foreground/90">
                    安全登录
                  </h2>
                  <p className="text-muted-foreground">
                    保护您的账户安全，享受便捷的管理体验
                  </p>
                </div>
              </div>
              {/* 装饰性渐变 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </CardContent>
        </Card>

        <FieldDescription className="px-6 text-center text-sm">
          点击登录即表示您同意我们的{" "}
          <a href="#" className="underline underline-offset-2 hover:text-primary transition-colors">
            服务条款
          </a>{" "}
          和{" "}
          <a href="#" className="underline underline-offset-2 hover:text-primary transition-colors">
            隐私政策
          </a>
          。
        </FieldDescription>
      </div>
    </div>
  )
}

