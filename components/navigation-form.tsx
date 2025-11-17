"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RichTextEditor } from "@/components/rich-text-editor"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, X } from "lucide-react"
import Link from "next/link"

interface Navigation {
  id: string
  title: string
  shortDescription: string | null
  description: string | null
  url: string
  icon: string | null
  isPublic: boolean
  tags: { tag: { name: string; id: string } }[]
}

interface NavigationFormProps {
  navigation?: Navigation
}

export function NavigationForm({ navigation }: NavigationFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [tags, setTags] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    shortDescription: "",
    description: "",
    icon: "",
    tagInput: "",
    selectedTags: [] as string[],
    isPublic: true,
  })

  useEffect(() => {
    fetchTags()
    if (navigation) {
      setFormData({
        title: navigation.title,
        url: navigation.url,
        shortDescription: navigation.shortDescription || "",
        description: navigation.description || "",
        icon: navigation.icon || "",
        tagInput: "",
        selectedTags: navigation.tags.map((t) => t.tag.id),
        isPublic: navigation.isPublic ?? true,
      })
    }
  }, [navigation])

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags")
      const data = await res.json()
      setTags(data)
    } catch (error) {
      console.error("Failed to fetch tags:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = navigation ? "PUT" : "POST"
      const url = navigation
        ? `/api/navigations/${navigation.id}`
        : "/api/navigations"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          url: formData.url,
          shortDescription: formData.shortDescription || null,
          description: formData.description || null,
          icon: formData.icon || null,
          isPublic: formData.isPublic,
          tagIds: formData.selectedTags,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "操作失败")
      }

      toast({
        title: "成功",
        description: navigation ? "更新成功" : "创建成功",
      })

      router.push("/admin")
      router.refresh()
    } catch (error) {
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "操作失败",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTagInputKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && formData.tagInput.trim()) {
      e.preventDefault()
      const tagName = formData.tagInput.trim()

      // 检查标签是否已存在
      let tag = tags.find((t) => t.name === tagName)
      if (!tag) {
        // 创建新标签
        try {
          const res = await fetch("/api/tags", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: tagName }),
          })
          const newTag = await res.json()
          tag = newTag
          if (tag) {
            setTags([...tags, tag])
          }
        } catch (error) {
          toast({
            title: "错误",
            description: "创建标签失败",
            variant: "destructive",
          })
          return
        }
      }

      if (tag && !formData.selectedTags.includes(tag.id)) {
        setFormData({
          ...formData,
          selectedTags: [...formData.selectedTags, tag.id],
          tagInput: "",
        })
      }
    }
  }

  const removeTag = (tagId: string) => {
    setFormData({
      ...formData,
      selectedTags: formData.selectedTags.filter((id) => id !== tagId),
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          {navigation ? "编辑导航" : "新增导航"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">
            网站名称 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            placeholder="请输入网站名称"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">
            网站地址 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="url"
            type="url"
            value={formData.url}
            onChange={(e) =>
              setFormData({ ...formData, url: e.target.value })
            }
            required
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription">简短描述</Label>
          <Input
            id="shortDescription"
            value={formData.shortDescription}
            onChange={(e) =>
              setFormData({
                ...formData,
                shortDescription: e.target.value,
              })
            }
            placeholder="一句话描述这个网站"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">详细介绍</Label>
          <RichTextEditor
            content={formData.description}
            onChange={(content) =>
              setFormData({ ...formData, description: content })
            }
            placeholder="输入详细介绍内容..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">图标URL</Label>
          <Input
            id="icon"
            type="url"
            value={formData.icon}
            onChange={(e) =>
              setFormData({ ...formData, icon: e.target.value })
            }
            placeholder="https://example.com/favicon.ico"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPublic"
            checked={formData.isPublic}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isPublic: checked === true })
            }
          />
          <Label
            htmlFor="isPublic"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            公开显示（未登录用户可见）
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">标签</Label>
          <Input
            id="tags"
            value={formData.tagInput}
            onChange={(e) =>
              setFormData({ ...formData, tagInput: e.target.value })
            }
            onKeyDown={handleTagInputKeyDown}
            placeholder="输入标签后按回车添加"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.selectedTags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId)
              return tag ? (
                <Badge
                  key={tagId}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeTag(tagId)}
                >
                  {tag.name}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ) : null
            })}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Link href="/admin">
            <Button type="button" variant="outline">
              取消
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "保存中..." : navigation ? "更新" : "创建"}
          </Button>
        </div>
      </form>
    </div>
  )
}

