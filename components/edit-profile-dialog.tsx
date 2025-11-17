"use client"

import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialName: string
  initialEmail: string
  onSuccess?: (name: string, email: string) => void
}

export function EditProfileDialog({
  open,
  onOpenChange,
  initialName,
  initialEmail,
  onSuccess,
}: EditProfileDialogProps) {
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [isLoading, setIsLoading] = useState(false)

  // 当弹窗打开或初始值变化时，更新表单值
  useEffect(() => {
    if (open) {
      setName(initialName)
      setEmail(initialEmail)
    }
  }, [open, initialName, initialEmail])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email) {
      toast.error("请填写所有字段")
      return
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("邮箱格式不正确")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "修改用户信息失败")
        return
      }

      // 检查邮箱是否改变
      const emailChanged = email !== initialEmail
      
      if (emailChanged) {
        toast.success("用户信息修改成功，邮箱已更改，请重新登录")
      } else {
        toast.success("用户信息修改成功，请重新登录")
      }
      
      // 调用成功回调
      if (onSuccess && data.user) {
        onSuccess(data.user.name, data.user.email)
      }
      // 关闭弹窗
      onOpenChange(false)
      // 延迟一下再退出登录，让用户看到成功提示
      setTimeout(() => {
        signOut({ callbackUrl: "/admin/login" })
      }, 1000)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("修改用户信息失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>修改用户信息</DialogTitle>
          <DialogDescription>
            修改您的用户名和邮箱地址
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">用户名</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入用户名"
                disabled={isLoading}
                autoComplete="name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱地址"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "修改中..." : "确认修改"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

