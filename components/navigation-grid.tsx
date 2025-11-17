"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Eye, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

interface NavigationItem {
  id: string
  title: string
  shortDescription: string | null
  url: string
  icon: string | null
  visits: number
  createdAt: Date
  tags: { tag: { id: string; name: string } }[]
}

export function NavigationGrid() {
  const searchParams = useSearchParams()
  const [items, setItems] = useState<NavigationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = searchParams.get("q")
        const tag = searchParams.get("tag")
        const sortBy = searchParams.get("sortBy")

        const params = new URLSearchParams()
        if (q) params.set("q", q)
        if (tag) params.set("tag", tag)
        if (sortBy) params.set("sortBy", sortBy)

        const res = await fetch(`/api/navigations?${params.toString()}`)
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        const result = await res.json()
        
        // 处理新的 API 响应格式 { data: [...], pagination: {...} }
        if (result.data && Array.isArray(result.data)) {
          setItems(result.data)
        } else if (Array.isArray(result)) {
          // 兼容旧格式（向后兼容）
          setItems(result)
        } else {
          console.error("Invalid data format:", result)
          setItems([])
        }
      } catch (error) {
        console.error("Failed to fetch navigations:", error)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted w-3/4"></div>
              <div className="h-3 bg-muted w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">暂无数据</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <Card
          key={item.id}
          className="nav-card group hover:shadow-lg transition-all duration-300 hover:border-primary/50 relative animate-card-in"
          style={{
            animationDelay: `${index * 30}ms`,
          }}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {item.icon ? (
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={32}
                    height={32}
                    className="rounded"
                  />
                ) : (
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                    <span className="text-xs font-bold">
                      {item.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base line-clamp-1">
                    {item.title}
                  </CardTitle>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity relative z-10"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open(item.url, "_blank")
                }}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            {item.shortDescription && (
              <CardDescription className="line-clamp-2">
                {item.shortDescription}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-3">
              {item.tags.slice(0, 3).map(({ tag }) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{item.visits}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(item.createdAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
            </div>
            <Link
              href={`/navigation/${item.id}`}
              className="absolute inset-0 z-0"
              aria-label={`查看 ${item.title} 详情`}
              onClick={(e) => {
                // 如果点击的是外链按钮，不跳转
                const target = e.target as HTMLElement
                if (target.closest('button')) {
                  e.preventDefault()
                }
              }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

