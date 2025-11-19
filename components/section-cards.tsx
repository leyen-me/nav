"use client"

import * as React from "react"
import { IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Stats {
  totalNavigations: number
  totalVisits: number
  pendingSubmissions: number
  totalUsers: number
}

interface SectionCardsProps {
  stats: Stats
}

export function SectionCards({ stats }: SectionCardsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card !bg-primary !text-primary-foreground">
        <CardHeader>
          <CardDescription className="!text-primary-foreground/70">
            总导航数量
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl !text-primary-foreground">
            {stats.totalNavigations.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge
              variant="secondary"
              className="!bg-primary-foreground/20 !text-primary-foreground !border-primary-foreground/30"
            >
              <IconTrendingUp />
              已审核通过
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium !text-primary-foreground">
            所有已审核的导航链接 <IconTrendingUp className="size-4" />
          </div>
          <div className="!text-primary-foreground/70">
            当前系统中的导航总数
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>总访问量</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(stats.totalVisits)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              累计访问
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            所有导航的总访问次数 <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            反映用户活跃度
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>待审核提交</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.pendingSubmissions}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.pendingSubmissions > 0 ? "待处理" : "已完成"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.pendingSubmissions > 0 ? "需要审核的提交" : "暂无待审核项"} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            用户提交的新网站链接
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>总用户数</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalUsers.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              注册用户
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            系统注册用户总数 <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">平台用户规模</div>
        </CardFooter>
      </Card>
    </div>
  )
}
