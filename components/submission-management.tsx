"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Check, X, ExternalLink, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface Submission {
  id: string
  title: string
  url: string
  description: string | null
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
  reviewedAt: string | null
  reviewedBy: string | null
}

export function SubmissionManagement() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("pending")
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null)
  const { toast } = useToast()

  const fetchSubmissions = async (status?: string) => {
    setLoading(true)
    try {
      const params = status ? `?status=${status}` : ""
      const response = await fetch(`/api/submissions${params}`)
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      }
    } catch (error) {
      console.error("获取提交列表失败:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions(selectedStatus === "all" ? undefined : selectedStatus)
  }, [selectedStatus])

  const handleReview = (submission: Submission, action: "approve" | "reject") => {
    setSelectedSubmission(submission)
    setReviewAction(action)
    setReviewDialogOpen(true)
  }

  const confirmReview = async () => {
    if (!selectedSubmission || !reviewAction) return

    try {
      const response = await fetch(`/api/submissions/${selectedSubmission.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: reviewAction === "approve" ? "approved" : "rejected",
        }),
      })

      if (response.ok) {
        setReviewDialogOpen(false)
        setSelectedSubmission(null)
        setReviewAction(null)
        fetchSubmissions(selectedStatus === "all" ? undefined : selectedStatus)
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "操作失败",
          description: error.error || "操作失败",
        })
      }
    } catch (error) {
      console.error("审核失败:", error)
      toast({
        variant: "destructive",
        title: "操作失败",
        description: "操作失败，请稍后重试",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="px-3 py-1">待审核</Badge>
      case "approved":
        return <Badge variant="default" className="px-3 py-1">已通过</Badge>
      case "rejected":
        return <Badge variant="destructive" className="px-3 py-1">已拒绝</Badge>
      default:
        return <Badge className="px-3 py-1">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList>
          <TabsTrigger value="pending">待审核</TabsTrigger>
          <TabsTrigger value="approved">已通过</TabsTrigger>
          <TabsTrigger value="rejected">已拒绝</TabsTrigger>
          <TabsTrigger value="all">全部</TabsTrigger>
        </TabsList>
        <TabsContent value={selectedStatus} className="mt-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              加载中...
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无数据
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>网站名称</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>提交时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.title}
                      </TableCell>
                      <TableCell>
                        <a
                          href={submission.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {submission.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {submission.description || "-"}
                      </TableCell>
                      <TableCell className="py-3">
                        {getStatusBadge(submission.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(submission.createdAt).toLocaleString("zh-CN")}
                      </TableCell>
                      <TableCell>
                        {submission.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleReview(submission, "approve")}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              通过
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReview(submission, "reject")}
                            >
                              <X className="h-4 w-4 mr-1" />
                              拒绝
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve" ? "确认通过" : "确认拒绝"}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === "approve"
                ? "通过后，该网站将自动添加到导航列表中。"
                : "拒绝后，该提交将被标记为已拒绝。"}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-2 py-4">
              <div>
                <strong>网站名称：</strong>
                {selectedSubmission.title}
              </div>
              <div>
                <strong>URL：</strong>
                <a
                  href={selectedSubmission.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {selectedSubmission.url}
                </a>
              </div>
              {selectedSubmission.description && (
                <div>
                  <strong>描述：</strong>
                  {selectedSubmission.description}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReviewDialogOpen(false)
                setSelectedSubmission(null)
                setReviewAction(null)
              }}
            >
              取消
            </Button>
            <Button
              variant={reviewAction === "approve" ? "default" : "destructive"}
              onClick={confirmReview}
            >
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

