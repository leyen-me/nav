"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // 当滚动超过 300px 时显示按钮
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <Button
      onClick={scrollToTop}
      variant="outline"
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full transition-all duration-300",
        "bg-background/80 backdrop-blur-sm border-border/50",
        "h-12 w-12 p-0",
        "hover:bg-background hover:scale-105 active:scale-95",
        "shadow-sm hover:shadow-md",
        isVisible
          ? "opacity-60 translate-y-0 hover:opacity-100"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-label="滚动到顶部"
    >
      <ArrowUp className="h-7 w-7" />
    </Button>
  )
}

