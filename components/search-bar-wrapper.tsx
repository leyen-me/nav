"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function SearchBarWrapper({ children }: { children: React.ReactNode }) {
  const [isFixedVisible, setIsFixedVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const originalSearchBar = document.querySelector('[data-search-bar="original"]')
      if (!originalSearchBar) return

      const rect = originalSearchBar.getBoundingClientRect()
      // 使用与 FixedSearchBar 相同的阈值逻辑，确保同步
      // 显示阈值：100px，隐藏阈值：120px（hysteresis 避免闪烁）
      const showThreshold = 100
      const hideThreshold = 120
      
      // 使用相同的逻辑，避免边界闪烁
      if (rect.top < showThreshold) {
        setIsFixedVisible(true)
      } else if (rect.top > hideThreshold) {
        setIsFixedVisible(false)
      }
      // 在中间区域保持当前状态不变
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        isFixedVisible && "opacity-40 scale-[0.98]"
      )}
    >
      {children}
    </div>
  )
}

