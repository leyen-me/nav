"use client"

import { useBackgroundConfig } from "@/hooks/use-background-config"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function BackgroundSettings() {
  const { config, setShowGrid, setShowParticles, setShowHeaderBlur } = useBackgroundConfig()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 transition-all duration-200 ease-out hover:scale-105 hover:bg-accent/50"
          aria-label="背景设置"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>背景设置</SheetTitle>
          <SheetDescription>
            调整背景效果以优化性能或个性化体验
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="grid-toggle" className="text-base">
                网格背景
              </Label>
              <p className="text-sm text-muted-foreground">
                显示动态网格背景（可能影响性能）
              </p>
            </div>
            <Switch
              id="grid-toggle"
              checked={config.showGrid}
              onCheckedChange={setShowGrid}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="particles-toggle" className="text-base">
                粒子效果
              </Label>
              <p className="text-sm text-muted-foreground">
                显示动态粒子效果
              </p>
            </div>
            <Switch
              id="particles-toggle"
              checked={config.showParticles}
              onCheckedChange={setShowParticles}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="header-blur-toggle" className="text-base">
                Header 模糊效果
              </Label>
              <p className="text-sm text-muted-foreground">
                启用 Header 的毛玻璃模糊效果（关闭时使用纯色背景）
              </p>
            </div>
            <Switch
              id="header-blur-toggle"
              checked={config.showHeaderBlur}
              onCheckedChange={setShowHeaderBlur}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

