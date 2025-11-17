"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

type SortType = "created" | "visits" | null

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isInitialMount = useRef(true)
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tag = searchParams.get("tag")
    return tag ? [tag] : []
  })
  const [sortBy, setSortBy] = useState<SortType>(
    (searchParams.get("sortBy") as SortType) || null
  )
  const [tags, setTags] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch(console.error)
  }, [])

  // 只在用户操作时更新 URL，避免循环
  useEffect(() => {
    // 跳过首次渲染
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    
    const currentTag = searchParams.get("tag")
    const currentSortBy = searchParams.get("sortBy")
    
    const newTag = selectedTags.length > 0 ? selectedTags[0] : null
    const newSortBy = sortBy
    
    // 只有当值真正改变时才更新 URL
    if (currentTag === newTag && currentSortBy === newSortBy) {
      return
    }
    
    const params = new URLSearchParams(searchParams.toString())
    if (newTag) {
      params.set("tag", newTag)
    } else {
      params.delete("tag")
    }
    if (newSortBy) {
      params.set("sortBy", newSortBy)
    } else {
      params.delete("sortBy")
    }
    router.replace(`/?${params.toString()}`, { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags, sortBy])

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [tagName]
    )
  }


  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* 标签筛选 */}
      <div className="flex flex-wrap gap-2 md:gap-2.5 justify-center sm:justify-start">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.name)
          return (
            <Badge
              key={tag.id}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 text-sm px-4 py-2 font-medium rounded-full ${
                isSelected
                  ? "bg-primary text-primary-foreground scale-105 border-2 border-primary/50"
                  : "bg-background/60 backdrop-blur-md hover:bg-background/80 hover:text-foreground hover:scale-105 border-2 border-border/50 hover:border-primary/30"
              }`}
              onClick={() => toggleTag(tag.name)}
            >
              {tag.name}
            </Badge>
          )
        })}
      </div>

      {/* 排序 - 使用 div 实现，风格与 tag 保持一致 */}
      <div className="flex flex-wrap gap-2 md:gap-2.5 justify-center sm:justify-end">
        <div
          onClick={() => setSortBy(sortBy === "created" ? null : "created")}
          style={
            sortBy === "created"
              ? {
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-primary-foreground)",
                }
              : undefined
          }
          className={`cursor-pointer transition-all duration-200 text-sm px-4 py-2 font-medium rounded-full flex items-center gap-1.5 ${
            sortBy === "created"
              ? "scale-105 border-2 border-primary/50"
              : "bg-background/60 backdrop-blur-md hover:bg-background/80 hover:text-foreground hover:scale-105 border-2 border-border/50 hover:border-primary/30"
          }`}
          aria-label="按创建时间排序"
        >
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">按创建时间</span>
          <span className="sm:hidden">最新</span>
        </div>
        <div
          onClick={() => setSortBy(sortBy === "visits" ? null : "visits")}
          style={
            sortBy === "visits"
              ? {
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-primary-foreground)",
                }
              : undefined
          }
          className={`cursor-pointer transition-all duration-200 text-sm px-4 py-2 font-medium rounded-full flex items-center gap-1.5 ${
            sortBy === "visits"
              ? "scale-105 border-2 border-primary/50"
              : "bg-background/60 backdrop-blur-md hover:bg-background/80 hover:text-foreground hover:scale-105 border-2 border-border/50 hover:border-primary/30"
          }`}
          aria-label="按访问量排序"
        >
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">按访问量</span>
          <span className="sm:hidden">热门</span>
        </div>
      </div>
    </div>
  )
}

