import { parse } from "node-html-parser"
import { prisma } from "@/lib/prisma"

interface IconResult {
  iconId: string
  iconUrl: string
}

/**
 * 从 URL 中提取图标链接
 */
async function extractIconUrls(url: string): Promise<string[]> {
  const iconUrls: string[] = []
  
  try {
    const domain = new URL(url).origin
    
    // 1. 先尝试标准的 favicon.ico
    iconUrls.push(`${domain}/favicon.ico`)
    
    // 2. 尝试获取 HTML 并解析 link 标签
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        signal: AbortSignal.timeout(10000), // 10秒超时
      })
      
      if (response.ok) {
        const html = await response.text()
        const root = parse(html)
        
        // 查找所有可能的图标 link 标签
        const iconSelectors = [
          'link[rel="icon"]',
          'link[rel="shortcut icon"]',
          'link[rel="apple-touch-icon"]',
          'link[rel="apple-touch-icon-precomposed"]',
        ]
        
        for (const selector of iconSelectors) {
          const links = root.querySelectorAll(selector)
          for (const link of links) {
            const href = link.getAttribute("href")
            if (href) {
              // 处理相对路径
              if (href.startsWith("http")) {
                iconUrls.push(href)
              } else if (href.startsWith("//")) {
                iconUrls.push(`https:${href}`)
              } else if (href.startsWith("/")) {
                iconUrls.push(`${domain}${href}`)
              } else {
                iconUrls.push(`${domain}/${href}`)
              }
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch HTML from ${url}:`, error)
    }
  } catch (error) {
    console.error(`Failed to extract icon URLs from ${url}:`, error)
  }
  
  return iconUrls
}

/**
 * 下载图标并返回二进制数据和 MIME 类型
 */
async function downloadIcon(
  iconUrl: string
): Promise<{ data: Buffer; mimeType: string } | null> {
  try {
    const response = await fetch(iconUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(10000), // 10秒超时
    })
    
    if (!response.ok) {
      return null
    }
    
    // 获取 Content-Type
    let mimeType = response.headers.get("content-type") || "image/x-icon"
    
    // 如果 Content-Type 不是图片类型，尝试根据 URL 推断
    if (!mimeType.startsWith("image/")) {
      if (iconUrl.endsWith(".png")) {
        mimeType = "image/png"
      } else if (iconUrl.endsWith(".jpg") || iconUrl.endsWith(".jpeg")) {
        mimeType = "image/jpeg"
      } else if (iconUrl.endsWith(".gif")) {
        mimeType = "image/gif"
      } else if (iconUrl.endsWith(".svg")) {
        mimeType = "image/svg+xml"
      } else {
        mimeType = "image/x-icon"
      }
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // 验证是否是有效的图片数据（至少有一些字节）
    if (buffer.length < 100) {
      console.warn(`Downloaded icon from ${iconUrl} is too small (${buffer.length} bytes)`)
      return null
    }
    
    return { data: buffer, mimeType }
  } catch (error) {
    console.error(`Failed to download icon from ${iconUrl}:`, error)
    return null
  }
}

/**
 * 保存图标到数据库
 */
async function saveIconToDatabase(
  data: Buffer,
  mimeType: string
): Promise<string> {
  const icon = await prisma.icon.create({
    data: {
      // @ts-ignore - Buffer is compatible with Bytes type
      data,
      mimeType,
    },
  })
  
  return icon.id
}

/**
 * 下载并保存网站图标
 * @param url 网站 URL
 * @returns 图标 ID 和图标访问 URL，如果失败返回 null
 */
export async function downloadAndSaveFavicon(
  url: string
): Promise<IconResult | null> {
  try {
    // 1. 提取所有可能的图标 URLs
    const iconUrls = await extractIconUrls(url)
    
    if (iconUrls.length === 0) {
      console.warn(`No icon URLs found for ${url}`)
      return null
    }
    
    // 2. 依次尝试下载图标
    for (const iconUrl of iconUrls) {
      const result = await downloadIcon(iconUrl)
      
      if (result) {
        // 3. 保存到数据库
        const iconId = await saveIconToDatabase(result.data, result.mimeType)
        const iconApiUrl = `/api/icons/${iconId}`
        
        console.log(`✓ Successfully downloaded and saved icon from ${iconUrl}`)
        return { iconId, iconUrl: iconApiUrl }
      }
    }
    
    console.warn(`Failed to download any icon for ${url}`)
    return null
  } catch (error) {
    console.error(`Error processing favicon for ${url}:`, error)
    return null
  }
}

/**
 * 更新 Navigation 记录的图标
 */
export async function updateNavigationIcon(
  navigationId: string,
  iconResult: IconResult
): Promise<void> {
  await prisma.navigation.update({
    where: { id: navigationId },
    data: {
      icon: iconResult.iconUrl,
      iconId: iconResult.iconId,
    },
  })
}

