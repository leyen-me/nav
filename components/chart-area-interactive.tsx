"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

interface VisitTrendItem {
  date: string
  visits: number
}

interface ChartAreaInteractiveProps {
  visitTrend: VisitTrendItem[]
}

const chartConfig = {
  visits: {
    label: "访问量",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ visitTrend }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = React.useMemo(() => {
    if (!visitTrend || visitTrend.length === 0) {
      return []
    }

    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return visitTrend.filter((item) => {
      const date = new Date(item.date)
      return date >= startDate
    })
  }, [visitTrend, timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>访问量趋势</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            过去 {timeRange === "90d" ? "3个月" : timeRange === "30d" ? "30天" : "7天"} 的访问量统计
          </span>
          <span className="@[540px]/card:hidden">
            {timeRange === "90d" ? "过去3个月" : timeRange === "30d" ? "过去30天" : "过去7天"}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">过去3个月</ToggleGroupItem>
            <ToggleGroupItem value="30d">过去30天</ToggleGroupItem>
            <ToggleGroupItem value="7d">过去7天</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="选择时间范围"
            >
              <SelectValue placeholder="过去3个月" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                过去3个月
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                过去30天
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                过去7天
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            暂无数据
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-visits)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-visits)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("zh-CN", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("zh-CN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="visits"
                type="natural"
                fill="url(#fillVisits)"
                stroke="var(--color-visits)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
