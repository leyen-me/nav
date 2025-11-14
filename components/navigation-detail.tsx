"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Eye, Calendar } from "lucide-react"
import Image from "next/image"
import { useEffect } from "react"
import { gsap } from "gsap"

interface NavigationDetailProps {
  navigation: {
    id: string
    title: string
    shortDescription: string | null
    description: string | null
    url: string
    icon: string | null
    visits: number
    createdAt: Date
    tags: { tag: { name: string } }[]
  }
}

export function NavigationDetail({ navigation }: NavigationDetailProps) {
  useEffect(() => {
    gsap.from(".detail-content", {
      y: 20,
      duration: 0.6,
      ease: "power2.out",
    })
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6 detail-content relative z-10">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {navigation.icon ? (
                <Image
                  src={navigation.icon}
                  alt={navigation.title}
                  width={64}
                  height={64}
                  className="rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {navigation.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <CardTitle className="text-2xl">{navigation.title}</CardTitle>
                {navigation.shortDescription && (
                  <CardDescription className="mt-2 text-base">
                    {navigation.shortDescription}
                  </CardDescription>
                )}
              </div>
            </div>
            <Button
              onClick={() => window.open(navigation.url, "_blank")}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              访问网站
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {navigation.tags.map(({ tag }) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>访问量: {navigation.visits}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                创建时间:{" "}
                {new Date(navigation.createdAt).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {navigation.description && (
        <Card>
          <CardHeader>
            <CardTitle>详细介绍</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: navigation.description }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

