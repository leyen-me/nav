"use client"

import { useState, useEffect } from "react"

interface BackgroundConfig {
  showGrid: boolean
  showParticles: boolean
  showHeaderBlur: boolean
}

const DEFAULT_CONFIG: BackgroundConfig = {
  showGrid: false,
  showParticles: false,
  showHeaderBlur: true,
}

const STORAGE_KEY = "nav-background-config"

export function useBackgroundConfig() {
  const [config, setConfig] = useState<BackgroundConfig>(DEFAULT_CONFIG)
  const [isLoaded, setIsLoaded] = useState(false)

  // 从 localStorage 加载配置
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setConfig({ ...DEFAULT_CONFIG, ...parsed })
      }
    } catch (error) {
      console.error("Failed to load background config:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // 更新配置并保存到 localStorage
  const updateConfig = (updates: Partial<BackgroundConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig))
    } catch (error) {
      console.error("Failed to save background config:", error)
    }
  }

  return {
    config,
    isLoaded,
    updateConfig,
    setShowGrid: (show: boolean) => updateConfig({ showGrid: show }),
    setShowParticles: (show: boolean) => updateConfig({ showParticles: show }),
    setShowHeaderBlur: (show: boolean) => updateConfig({ showHeaderBlur: show }),
  }
}

