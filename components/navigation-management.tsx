"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, X, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Navigation {
  id: string
  title: string
  shortDescription: string | null
  description: string | null
  url: string
  icon: string | null
  visits: number
  createdAt: Date
  tags: { tag: { name: string; id: string } }[]
}

export function NavigationManagement() {
  const [navigations, setNavigations] = useState<Navigation[]>([])
  const [tags, setTags] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    shortDescription: "",
    description: "",
    icon: "",
    tagInput: "",
    selectedTags: [] as string[],
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchNavigations()
    fetchTags()
  }, [])

  const fetchNavigations = async () => {
    try {
      const res = await fetch("/api/navigations")
      const data = await res.json()
      setNavigations(data)
    } catch (error) {
      toast({
        title: "错误",
        description: "获取导航数据失败",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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
    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId
        ? `/api/navigations/${editingId}`
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
          tagIds: formData.selectedTags,
        }),
      })

      if (!res.ok) throw new Error("操作失败")

      toast({
        title: "成功",
        description: editingId ? "更新成功" : "创建成功",
      })

      setDialogOpen(false)
      resetForm()
      fetchNavigations()
    } catch (error) {
      toast({
        title: "错误",
        description: "操作失败",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除吗？")) return

    try {
      const res = await fetch(`/api/navigations/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("删除失败")

      toast({
        title: "成功",
        description: "删除成功",
      })

      fetchNavigations()
    } catch (error) {
      toast({
        title: "错误",
        description: "删除失败",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (nav: Navigation) => {
    setEditingId(nav.id)
    setFormData({
      title: nav.title,
      url: nav.url,
      shortDescription: nav.shortDescription || "",
      description: nav.description || "",
      icon: nav.icon || "",
      tagInput: "",
      selectedTags: nav.tags.map((t) => t.tag.id),
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      url: "",
      shortDescription: "",
      description: "",
      icon: "",
      tagInput: "",
      selectedTags: [],
    })
    setEditingId(null)
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
          setTags([...tags, tag])
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

  const handleUpdateFavicons = async () => {
    if (!confirm("确定要更新所有缺失的 favicon 吗？这可能需要一些时间。")) return

    try {
      toast({
        title: "开始更新",
        description: "正在更新 favicon，请稍候...",
      })

      const res = await fetch("/api/cron/update-favicons", {
        method: "POST",
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "更新完成",
          description: `成功更新 ${data.updated}/${data.total} 个 favicon`,
        })
        fetchNavigations()
      } else {
        throw new Error(data.error || "更新失败")
      }
    } catch (error) {
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "更新失败",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">导航列表</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleUpdateFavicons}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            更新 Favicon
          </Button>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                添加导航
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "编辑导航" : "添加导航"}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? "修改导航信息"
                    : "添加一个新的导航网站"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">网站名称 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">网站地址 *</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    required
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">详细介绍</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={6}
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
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false)
                      resetForm()
                    }}
                  >
                    取消
                  </Button>
                  <Button type="submit">
                    {editingId ? "更新" : "创建"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>标签</TableHead>
              <TableHead>访问量</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : navigations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              navigations.map((nav) => (
                <TableRow key={nav.id}>
                  <TableCell className="font-medium">{nav.title}</TableCell>
                  <TableCell>
                    <a
                      href={nav.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {nav.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {nav.tags.map(({ tag }) => (
                        <Badge key={tag.id} variant="secondary">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{nav.visits}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(nav)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(nav.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

