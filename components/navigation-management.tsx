"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, RefreshCw, Search } from "lucide-react"
import { toast } from "sonner"

interface Navigation {
  id: string
  title: string
  shortDescription: string | null
  description: string | null
  url: string
  icon: string | null
  visits: number
  createdAt: Date
  isPublic: boolean
  tags: { tag: { name: string; id: string } }[]
}

interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

interface Tag {
  id: string
  name: string
}

export function NavigationManagement() {
  const [navigations, setNavigations] = useState<Navigation[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("created")
  const [tags, setTags] = useState<Tag[]>([])
  const [updateFaviconDialogOpen, setUpdateFaviconDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [navigationToDelete, setNavigationToDelete] = useState<Navigation | null>(null)

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags")
      const data = await res.json()
      setTags(data)
    } catch (error) {
      console.error("获取标签失败:", error)
    }
  }

  const fetchNavigations = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", pagination.page.toString())
      params.set("pageSize", pagination.pageSize.toString())
      if (searchQuery) params.set("q", searchQuery)
      if (selectedTag && selectedTag !== "all") params.set("tag", selectedTag)
      if (sortBy) params.set("sortBy", sortBy)

      const res = await fetch(`/api/navigations?${params.toString()}`)
      const result = await res.json()
      
      if (res.ok && result.data) {
        setNavigations(result.data)
        // 更新分页信息（API 返回的是当前请求的分页信息）
        setPagination((prev) => {
          // 如果 page 和 pageSize 与请求时相同，则更新 total 和 totalPages
          // 这样可以避免不必要的重新渲染
          if (prev.page === result.pagination.page && prev.pageSize === result.pagination.pageSize) {
            return {
              ...prev,
              total: result.pagination.total,
              totalPages: result.pagination.totalPages,
            }
          }
          // 如果不同，则完全更新（这种情况应该很少发生）
          return result.pagination
        })
      } else {
        throw new Error(result.error || "获取导航数据失败")
      }
    } catch (error) {
      toast.error("错误", {
        description: error instanceof Error ? error.message : "获取导航数据失败",
      })
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.pageSize, searchQuery, selectedTag, sortBy])

  useEffect(() => {
    fetchNavigations()
  }, [fetchNavigations])

  const handleDelete = (nav: Navigation) => {
    setNavigationToDelete(nav)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!navigationToDelete) return

    setDeleteDialogOpen(false)

    try {
      const res = await fetch(`/api/navigations/${navigationToDelete.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("删除失败")

      toast.success("成功", {
        description: "删除成功",
      })

      setNavigationToDelete(null)
      fetchNavigations()
    } catch (error) {
      toast.error("错误", {
        description: "删除失败",
      })
    }
  }

  const handleUpdateFavicons = () => {
    setUpdateFaviconDialogOpen(true)
  }

  const confirmUpdateFavicons = async () => {
    setUpdateFaviconDialogOpen(false)

    try {
      toast.info("开始更新", {
        description: "正在更新 favicon，请稍候...",
      })

      const res = await fetch("/api/cron/update-favicons", {
        method: "POST",
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("更新完成", {
          description: `成功更新 ${data.updated}/${data.total} 个 favicon`,
        })
        fetchNavigations()
      } else {
        throw new Error(data.error || "更新失败")
      }
    } catch (error) {
      toast.error("错误", {
        description: error instanceof Error ? error.message : "更新失败",
      })
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleTagChange = (value: string) => {
    setSelectedTag(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handlePageSizeChange = (pageSize: string) => {
    setPagination((prev) => ({ ...prev, pageSize: parseInt(pageSize), page: 1 }))
  }

  const renderPagination = () => {
    const { page, totalPages } = pagination
    const pages: (number | string)[] = []
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push("ellipsis")
        pages.push(totalPages)
      } else if (page >= totalPages - 2) {
        pages.push(1)
        pages.push("ellipsis")
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push("ellipsis")
        for (let i = page - 1; i <= page + 1; i++) pages.push(i)
        pages.push("ellipsis")
        pages.push(totalPages)
      }
    }

    return (
      <Pagination className="mx-0 justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page > 1) handlePageChange(page - 1)
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          {pages.map((p, index) => (
            <PaginationItem key={index}>
              {p === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(p as number)
                  }}
                  isActive={page === p}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page < totalPages) handlePageChange(page + 1)
              }}
              className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-col lg:flex-row gap-2">
        {/* 搜索框 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索导航名称、描述或 URL..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {/* 筛选和操作 */}
        <div className="flex flex-wrap gap-2">
          <Select value={selectedTag} onValueChange={handleTagChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="全部标签" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">全部标签</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.name}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="排序" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">按创建时间</SelectItem>
              <SelectItem value="visits">按访问量</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={pagination.pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 条/页</SelectItem>
              <SelectItem value="20">20 条/页</SelectItem>
              <SelectItem value="50">50 条/页</SelectItem>
              <SelectItem value="100">100 条/页</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden lg:block w-px bg-border mx-1" />
          
          <Link href="/admin/navigations/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加导航
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleUpdateFavicons}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            更新图标
          </Button>
        </div>
      </div>

      {/* 表格容器 */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">名称</TableHead>
                <TableHead className="font-semibold">URL</TableHead>
                <TableHead className="font-semibold">标签</TableHead>
                <TableHead className="font-semibold text-center">访问量</TableHead>
                <TableHead className="font-semibold text-center">可见性</TableHead>
                <TableHead className="font-semibold text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">加载中...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : navigations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-12 w-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground font-medium">暂无数据</p>
                      <p className="text-sm text-muted-foreground/70">
                        {searchQuery || selectedTag !== "all" 
                          ? "尝试调整筛选条件" 
                          : "点击上方按钮添加导航"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                navigations.map((nav) => (
                  <TableRow key={nav.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium max-w-[200px]">
                      <div className="flex items-center gap-2">
                        {nav.icon && (
                          <img src={nav.icon} alt="" className="w-5 h-5 rounded" />
                        )}
                        <span className="truncate" title={nav.title}>{nav.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[250px]">
                      <a
                        href={nav.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate block transition-colors"
                        title={nav.url}
                      >
                        {nav.url}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {nav.tags.length > 0 ? (
                          nav.tags.map(({ tag }) => (
                            <Badge key={tag.id} variant="secondary" className="text-xs">
                              {tag.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">无标签</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium tabular-nums">{nav.visits.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={nav.isPublic ? "default" : "secondary"}
                        className="min-w-[60px] justify-center"
                      >
                        {nav.isPublic ? "公开" : "私有"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/admin/navigations/${nav.id}/edit`}>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            title="编辑"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(nav)}
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          title="删除"
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

      {/* 分页 */}
      {pagination.totalPages > 0 && (
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            共 {pagination.total.toLocaleString()} 条，第 {pagination.page} / {pagination.totalPages} 页
          </div>
          <div className="shrink-0">
            {renderPagination()}
          </div>
        </div>
      )}

      {/* 更新 Favicon 确认对话框 */}
      <Dialog open={updateFaviconDialogOpen} onOpenChange={setUpdateFaviconDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>更新 Favicon</DialogTitle>
            <DialogDescription>
              确定要更新所有缺失的 favicon 吗？这可能需要一些时间。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUpdateFaviconDialogOpen(false)}
            >
              取消
            </Button>
            <Button onClick={confirmUpdateFavicons}>
              确认更新
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除导航 "{navigationToDelete?.title}" 吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setNavigationToDelete(null)
              }}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

