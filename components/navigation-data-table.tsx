"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconExternalLink,
  IconTrendingUp,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Navigation {
  id: string
  title: string
  url: string
  visits: number
  createdAt: string
  tags: {
    tag: {
      id: string
      name: string
    }
  }[]
}

interface NavigationDataTableProps {
  navigations: Navigation[]
}

export function NavigationDataTable({
  navigations,
}: NavigationDataTableProps) {
  const [pageIndex, setPageIndex] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(10)

  const totalPages = Math.ceil(navigations.length / pageSize)
  const startIndex = pageIndex * pageSize
  const endIndex = startIndex + pageSize
  const currentNavigations = navigations.slice(startIndex, endIndex)

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>最受欢迎的导航</CardTitle>
        <CardDescription>按访问量排序的热门导航链接</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {currentNavigations.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            暂无数据
          </div>
        ) : (
          <div className="grid gap-3">
            {currentNavigations.map((navigation, index) => (
              <div
                key={navigation.id}
                className="group relative rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/navigation/${navigation.id}`}
                        className="font-semibold leading-tight group-hover:text-primary transition-colors hover:underline"
                      >
                        {navigation.title}
                      </Link>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
                        <IconTrendingUp className="h-4 w-4" />
                        <span className="font-medium tabular-nums">
                          {navigation.visits.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <a
                      href={navigation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 w-fit group/url"
                    >
                      <span className="truncate max-w-[200px] sm:max-w-none">
                        {navigation.url.length > 60
                          ? `${navigation.url.substring(0, 60)}...`
                          : navigation.url}
                      </span>
                      <IconExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover/url:opacity-100 transition-opacity" />
                    </a>
                    {navigation.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {navigation.tags.slice(0, 4).map(({ tag }) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                        {navigation.tags.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{navigation.tags.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {new Date(navigation.createdAt).toLocaleDateString(
                        "zh-CN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {navigations.length > pageSize && (
          <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-muted-foreground text-sm">
              显示 {currentNavigations.length} 条记录，共{" "}
              {navigations.length} 条
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  每页显示
                </Label>
                <Select
                  value={`${pageSize}`}
                  onValueChange={(value) => {
                    setPageSize(Number(value))
                    setPageIndex(0)
                  }}
                >
                  <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                    <SelectValue placeholder={pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((size) => (
                      <SelectItem key={size} value={`${size}`}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span>
                  第 {pageIndex + 1} 页，共 {totalPages} 页
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => setPageIndex(0)}
                  disabled={pageIndex === 0}
                >
                  <span className="sr-only">第一页</span>
                  <IconChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
                  disabled={pageIndex === 0}
                >
                  <span className="sr-only">上一页</span>
                  <IconChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() =>
                    setPageIndex((prev) => Math.min(totalPages - 1, prev + 1))
                  }
                  disabled={pageIndex >= totalPages - 1}
                >
                  <span className="sr-only">下一页</span>
                  <IconChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => setPageIndex(totalPages - 1)}
                  disabled={pageIndex >= totalPages - 1}
                >
                  <span className="sr-only">最后一页</span>
                  <IconChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

