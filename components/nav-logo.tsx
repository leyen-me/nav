"use client"

import { IconLayoutDashboard } from "@tabler/icons-react"

export function NavLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <IconLayoutDashboard className="size-6" />
      <span className="text-xl font-semibold tracking-tight">NAV</span>
    </div>
  )
}

