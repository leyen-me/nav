"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSearchParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  isCompact?: boolean
  className?: string
}

export function SearchBar({ isCompact = false, className }: SearchBarProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [search, setSearch] = useState(searchParams.get("q") || "")
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const isInitialMount = useRef(true)

  useEffect(() => {
    // 跳过首次渲染
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    
    const currentQ = searchParams.get("q") || ""
    
    // 如果值没有改变，不更新 URL
    if (currentQ === search) {
      return
    }
    
    // 防抖处理
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (search) {
        params.set("q", search)
      } else {
        params.delete("q")
      }
      router.replace(`/?${params.toString()}`, { scroll: false })
    }, 300)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <div className={cn("relative max-w-2xl md:max-w-3xl mx-auto", className)}>
      <div className="relative group">
        <Search className={cn(
          "absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary z-10",
          isCompact ? "h-4 w-4 md:h-4 md:w-4" : "h-4 w-4 md:h-5 md:w-5"
        )} />
        <Input
          type="search"
          placeholder="搜索网站、标签或关键词..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            "pl-11 md:pl-12 text-base md:text-lg",
            "bg-background/60 backdrop-blur-md",
            "border border-border/60",
            "transition-all duration-200 ease-out",
            "hover:bg-background/80 hover:border-border",
            "focus-visible:bg-background/95 focus-visible:border-primary/50 focus-visible:ring-primary/20 focus-visible:ring-2",
            "rounded-xl shadow-sm",
            isCompact ? "h-11 md:h-12 pl-10 md:pl-11" : "h-14 md:h-16"
          )}
        />
      </div>
    </div>
  )
}
