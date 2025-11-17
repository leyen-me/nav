"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSearchParams, useRouter } from "next/navigation"

export function SearchBar() {
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
    <div className="relative max-w-2xl md:max-w-3xl mx-auto">
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-muted-foreground transition-all duration-300 group-focus-within:text-foreground z-10" />
        <Input
          type="search"
          placeholder="搜索网站、标签或关键词..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-14 md:pl-16 h-16 md:h-20 text-base md:text-lg bg-background/80 backdrop-blur-xl border-2 border-border/50 transition-all duration-300 focus:border-primary/60 focus:bg-background/95 hover:border-primary/40 rounded-2xl"
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  )
}

