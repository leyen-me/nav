"use client"

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { SubmitDialog } from "./submit-dialog"

export function Header() {
  const [submitOpen, setSubmitOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold tracking-tight">
              NAV
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              首页
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSubmitOpen(true)}
              className="text-sm font-medium"
            >
              提交网站
            </Button>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              开源地址
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <nav className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSubmitOpen(true)}
            >
              提交
            </Button>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm">
                开源
              </Button>
            </Link>
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <SubmitDialog open={submitOpen} onOpenChange={setSubmitOpen} />
    </>
  )
}

