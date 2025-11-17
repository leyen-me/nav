"use client"

import { useEffect, useState } from "react"
import { useBackgroundConfig } from "@/hooks/use-background-config"

interface ParticleStyle {
  left: string
  top: string
  animationDelay: string
  animationDuration: string
}

export function AnimatedBackground() {
  const { config, isLoaded } = useBackgroundConfig()
  const [particles, setParticles] = useState<ParticleStyle[]>([])

  // 只在客户端挂载后生成粒子，避免 hydration 错误
  useEffect(() => {
    if (config.showParticles) {
      const particleStyles: ParticleStyle[] = Array.from({ length: 20 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${10 + Math.random() * 10}s`,
      }))
      setParticles(particleStyles)
    } else {
      setParticles([])
    }
  }, [config.showParticles])

  // 等待配置加载完成，避免闪烁
  if (!isLoaded) {
    return null
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 动态网格背景 */}
      {config.showGrid && (
        <div className="absolute inset-0 bg-grid-pattern" />
      )}
      
      {/* 垂直渐变遮罩 - 上面实，下面虚（苹果风格，符合阅读习惯） */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/70" />
      
      {/* 动态粒子效果 */}
      {config.showParticles && particles.length > 0 && (
        <div className="absolute inset-0">
          <div className="particle-container">
            {particles.map((particle, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: particle.left,
                  top: particle.top,
                  animationDelay: particle.animationDelay,
                  animationDuration: particle.animationDuration,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

