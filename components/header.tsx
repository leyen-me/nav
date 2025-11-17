"use client"

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { SubmitDialog } from "./submit-dialog"
import { NavLogo } from "./nav-logo"

export function Header() {
  const [submitOpen, setSubmitOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
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
              className="text-sm font-medium transition-all duration-200 ease-out hover:scale-105 hover:bg-accent/50"
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
      </header>
      <SubmitDialog open={submitOpen} onOpenChange={setSubmitOpen} />
    </>
  )
}

