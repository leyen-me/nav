"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

export function RegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // 验证密码确认
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name: name || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "注册失败，请重试")
        return
      }

      // 注册成功，跳转到登录页面
      router.push("/admin/login?registered=true")
    } catch (err) {
      setError("注册失败，请重试")
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
        <Card className="overflow-hidden p-0 shadow-2xl border-0 md:h-[650px] flex">
          <CardContent className="grid p-0 md:grid-cols-2 flex-1">
            <form className="p-8 md:p-10 lg:p-12 flex flex-col justify-center" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center mb-2">
                  <h1 className="text-3xl font-bold">创建管理员账户</h1>
                  <p className="text-muted-foreground text-balance">
                    首次部署，请创建您的管理员账户
                  </p>
                </div>

                {error && (
                  <div className="text-sm text-destructive text-center bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Field>
                  <FieldLabel htmlFor="name">姓名（可选）</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="管理员"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                  />
                </Field>

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
                    placeholder="至少6位"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-11"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">确认密码</FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="再次输入密码"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-11"
                  />
                </Field>

                <Field>
                  <Button type="submit" className="w-full h-11" disabled={loading}>
                    {loading ? "注册中..." : "注册"}
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
                        d="M40 60 L55 75 L80 45"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary/40"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2 text-foreground/90">
                    初始化系统
                  </h2>
                  <p className="text-muted-foreground">
                    创建第一个管理员账户以开始使用系统
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
          点击注册即表示您同意我们的{" "}
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

