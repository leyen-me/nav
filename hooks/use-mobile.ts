import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // 服务器端默认返回 false，避免 hydration 错误
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // 在客户端挂载之前返回 false，避免 hydration 错误
  if (!mounted) {
    return false
  }

  return isMobile
}
