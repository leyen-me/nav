"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Clock, TrendingUp } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    <div className="flex flex-col gap-4">
      {/* 标签筛选 */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTags.includes(tag.name) ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-sm px-3 py-1"
            onClick={() => toggleTag(tag.name)}
          >
            {tag.name}
          </Badge>
        ))}
      </div>

      {/* 排序 */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              排序
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setSortBy("created")}>
              <Clock className="mr-2 h-4 w-4" />
              按创建时间
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("visits")}>
              <TrendingUp className="mr-2 h-4 w-4" />
              按访问量
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy(null)}>
              清除排序
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

