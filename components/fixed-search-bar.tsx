"use client"

import { useState, useEffect } from "react"
import { SearchBar } from "./search-bar"
import { cn } from "@/lib/utils"

export function FixedSearchBar() {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    let hideTimer: NodeJS.Timeout | null = null
    let rafId: number | null = null

    const handleScroll = () => {
      // 查找原始搜索框容器
      const originalSearchBar = document.querySelector('[data-search-bar="original"]')
      if (!originalSearchBar) return

      const rect = originalSearchBar.getBoundingClientRect()
      // 使用不同的阈值来避免边界闪烁
      // 显示阈值：当滚动到 100px 以下时显示
      // 隐藏阈值：当滚动到 120px 以上时隐藏（hysteresis）
      const showThreshold = 100
      const hideThreshold = 120
      
      if (rect.top < showThreshold) {
        // 清除之前的隐藏定时器
        if (hideTimer) {
          clearTimeout(hideTimer)
          hideTimer = null
        }
        
        if (!shouldRender) {
          setShouldRender(true)
          // 下一帧再显示，确保 DOM 已渲染
          if (rafId) cancelAnimationFrame(rafId)
          rafId = requestAnimationFrame(() => {
            setIsVisible(true)
            rafId = null
          })
        } else if (!isVisible) {
          setIsVisible(true)
        }
      } else if (rect.top > hideThreshold) {
        // 只有在超过隐藏阈值时才隐藏
        setIsVisible(false)
        // 延迟移除 DOM，等待动画完成
        if (hideTimer) clearTimeout(hideTimer)
        hideTimer = setTimeout(() => {
          setShouldRender(false)
          hideTimer = null
        }, 300)
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
      if (hideTimer) {
        clearTimeout(hideTimer)
      }
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [isVisible, shouldRender])

  // 当固定搜索框显示时，隐藏 header 的 border-b
  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return

    if (isVisible) {
      header.classList.add('border-b-0')
    } else {
      header.classList.remove('border-b-0')
    }

    return () => {
      header.classList.remove('border-b-0')
    }
  }, [isVisible])

  if (!shouldRender) return null

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-[49] px-4 transition-all duration-300 ease-out",
        "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
        "shadow-sm"
      )}
      style={{
        top: "64px", // 恢复正常的 top 位置
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <div className="container max-w-2xl md:max-w-3xl mx-auto py-2.5">
        <SearchBar isCompact />
      </div>
    </div>
  )
}

