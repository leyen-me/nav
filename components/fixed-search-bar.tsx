"use client"

import { useState, useEffect } from "react"
import { SearchBar } from "./search-bar"
import { cn } from "@/lib/utils"

export function FixedSearchBar() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // 查找原始搜索框容器
      const originalSearchBar = document.querySelector('[data-search-bar="original"]')
      if (!originalSearchBar) return

      const rect = originalSearchBar.getBoundingClientRect()
      // 当原始搜索框滚动到距离顶部 80px 以下时，显示固定搜索框
      const threshold = 80
      
      if (rect.top < threshold) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // 监听滚动事件
    window.addEventListener("scroll", handleScroll, { passive: true })
    // 延迟一下再检查，确保 DOM 已渲染
    const timer = setTimeout(() => {
      handleScroll()
    }, 100)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-[49] px-4 transition-all duration-300",
        "bg-background/95 backdrop-blur-xl border-b shadow-sm"
      )}
      style={{
        top: "64px",
      }}
    >
      <div className="container max-w-2xl md:max-w-3xl mx-auto py-3">
        <SearchBar isCompact />
      </div>
    </div>
  )
}

