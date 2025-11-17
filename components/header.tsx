"use client"

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
// import { BackgroundSettings } from "./background-settings" // 保留代码，但不在界面显示
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { SubmitDialog } from "./submit-dialog"
import { NavLogo } from "./nav-logo"
import { SearchBar } from "./search-bar"
import { cn } from "@/lib/utils"
import { useBackgroundConfig } from "@/hooks/use-background-config"

export function Header() {
  const { config } = useBackgroundConfig()
  const [submitOpen, setSubmitOpen] = useState(false)
  const [isFixedSearchVisible, setIsFixedSearchVisible] = useState(false)
  const [shouldRenderFixedSearch, setShouldRenderFixedSearch] = useState(false)

  useEffect(() => {
    let hideTimer: NodeJS.Timeout | null = null
    let rafId: number | null = null

    const handleScroll = () => {
      const originalSearchBar = document.querySelector('[data-search-bar="original"]')
      if (!originalSearchBar) return

      const rect = originalSearchBar.getBoundingClientRect()
      const showThreshold = 100
      const hideThreshold = 120
      
      if (rect.top < showThreshold) {
        if (hideTimer) {
          clearTimeout(hideTimer)
          hideTimer = null
        }
        
        if (!shouldRenderFixedSearch) {
          setShouldRenderFixedSearch(true)
          if (rafId) cancelAnimationFrame(rafId)
          rafId = requestAnimationFrame(() => {
            setIsFixedSearchVisible(true)
            rafId = null
          })
        } else if (!isFixedSearchVisible) {
          setIsFixedSearchVisible(true)
        }
      } else if (rect.top > hideThreshold) {
        setIsFixedSearchVisible(false)
        if (hideTimer) clearTimeout(hideTimer)
        hideTimer = setTimeout(() => {
          setShouldRenderFixedSearch(false)
          hideTimer = null
        }, 300)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    const timer = setTimeout(() => {
      handleScroll()
    }, 100)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
      if (hideTimer) clearTimeout(hideTimer)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isFixedSearchVisible, shouldRenderFixedSearch])

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isFixedSearchVisible ? "border-b-0" : "border-b",
        // 根据配置决定是否使用模糊效果
        config.showHeaderBlur
          ? "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
          : "bg-card/80 shadow-sm" // 不使用模糊时，使用 card 背景色并添加阴影增加层级感
      )}>
        <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <NavLogo />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium transition-all duration-200 ease-out hover:text-primary hover:scale-105 px-2 py-1 rounded-md hover:bg-accent/50"
            >
              首页
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSubmitOpen(true)}
              className="text-sm font-medium transition-all duration-300 ease-out hover:scale-105 hover:bg-accent/50"
            >
              提交
            </Button>
            <Link
              href="https://github.com/leyen-me/nav"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-all duration-200 ease-out hover:text-primary hover:scale-105 px-2 py-1 rounded-md hover:bg-accent/50"
            >
              开源
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <nav className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSubmitOpen(true)}
              className="transition-all duration-200 ease-out hover:scale-105 hover:bg-accent/50"
            >
              提交
            </Button>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="ghost" 
                size="sm"
                className="transition-all duration-200 ease-out hover:scale-105 hover:bg-accent/50"
              >
                开源
              </Button>
            </Link>
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>

        {/* 固定搜索框 - 作为 header 的一部分 */}
        {shouldRenderFixedSearch && (
          <div
            className={cn(
              "transition-all duration-200 ease-out overflow-hidden",
              isFixedSearchVisible
                ? "max-h-20 opacity-100"
                : "max-h-0 opacity-0"
            )}
          >
            <div className="px-4 pb-2.5 pt-2">
              <div className="container max-w-2xl md:max-w-3xl mx-auto">
                <SearchBar isCompact />
              </div>
            </div>
          </div>
        )}
      </header>
      <SubmitDialog open={submitOpen} onOpenChange={setSubmitOpen} />
    </>
  )
}

