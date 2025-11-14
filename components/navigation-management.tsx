"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react"
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
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchNavigations()
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
          <Link href="/admin/navigations/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加导航
            </Button>
          </Link>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-48">名称</TableHead>
              <TableHead className="w-64">URL</TableHead>
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
                  <TableCell className="font-medium w-48 max-w-48 truncate" title={nav.title}>
                    {nav.title}
                  </TableCell>
                  <TableCell className="w-64 max-w-64">
                    <a
                      href={nav.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate block"
                      title={nav.url}
                    >
                      {nav.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
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
                      <Link href={`/admin/navigations/${nav.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
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

