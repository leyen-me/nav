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
    <div className="min-h-screen flex items-center justify-center bg-login-gradient p-4 relative overflow-hidden">
      {/* 动态背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 大型光晕 */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tl from-blue-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* 网格背景 */}
        <div className="absolute inset-0 bg-grid-subtle opacity-40" />
      </div>

      <div className={cn("flex flex-col gap-6 w-full max-w-5xl relative z-10")}>
        <Card className="overflow-hidden p-0 shadow-2xl border border-white/20 dark:border-white/10 md:h-[650px] flex backdrop-blur-sm bg-card/80">
          <CardContent className="grid p-0 md:grid-cols-2 flex-1">
            <form className="p-8 md:p-10 lg:p-12 flex flex-col justify-center" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center mb-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    创建管理员账户
                  </h1>
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

            {/* 右侧设计 - 渐变玻璃态风格 */}
            <div className="relative hidden md:flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-cyan-500/10">
              {/* 背景网格 */}
              <div className="absolute inset-0 bg-grid-pattern opacity-20" />
              
              {/* 浮动装饰光晕 */}
              <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-transparent rounded-full blur-2xl animate-float-slow" />
              <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-tr from-blue-400/30 to-transparent rounded-full blur-2xl animate-float-delayed" />
              
              {/* 主内容区 */}
              <div className="relative z-10 p-8 max-w-sm">
                {/* 浮动卡片组 */}
                <div className="relative mb-8">
                  {/* 卡片 1 - 后层 */}
                  <div className="absolute top-0 left-8 w-48 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg transform rotate-6 animate-float-card" />
                  
                  {/* 卡片 2 - 中层 */}
                  <div className="absolute top-4 left-4 w-48 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg transform -rotate-3 animate-float-card-delayed" />
                  
                  {/* 卡片 3 - 前层（主卡片） */}
                  <div className="relative w-48 h-32 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl flex items-center justify-center animate-float-card-slow">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg 
                          className="w-6 h-6 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 文字内容 */}
                <div className="text-center mt-40 space-y-3">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                    开始使用
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    创建您的第一个管理员账户，开启高效便捷的管理体验
                  </p>
                  
                  {/* 特性标签 */}
                  <div className="flex gap-2 justify-center pt-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 text-foreground/70">
                      ✨ 快速设置
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/20 text-foreground/70">
                      🚀 立即开始
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 点缀元素 */}
              <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400/60 rounded-full animate-ping" />
              <div className="absolute bottom-32 right-24 w-2 h-2 bg-blue-400/60 rounded-full animate-ping animation-delay-1000" />
              <div className="absolute top-40 right-16 w-1.5 h-1.5 bg-cyan-400/60 rounded-full animate-ping animation-delay-2000" />
            </div>
          </CardContent>
        </Card>

        <FieldDescription className="px-6 text-center text-sm text-muted-foreground/70">
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

