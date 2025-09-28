"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Brain, ArrowLeft, Send, Camera, Zap, Crown, AlertCircle, Loader2 } from "lucide-react"
import { useAppStore } from "@/components/store"
import { AdSlot } from "@/components/ad-slot"
import { ImageOCR } from "@/components/image-ocr"
import { trackEvent, AnalyticsEvents } from "@/components/analytics"
import { useToast } from "@/hooks/use-toast"

export default function AppPage() {
  const { plan, questionsToday, incrementQuestions, getRemainingQuestions, canAskQuestion } = useAppStore()
  const { toast } = useToast()

  const [question, setQuestion] = useState("")
  const [solution, setSolution] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showLimitDialog, setShowLimitDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("text")

  const remaining = getRemainingQuestions()
  const planLimits = { free: 5, mini: 50, standard: 50, pro: Number.POSITIVE_INFINITY }
  const currentLimit = planLimits[plan]
  const progressPercentage = currentLimit === Number.POSITIVE_INFINITY ? 0 : (questionsToday / currentLimit) * 100

  const handleSolveQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "Please enter a question",
        description: "Type your math or science problem to get started.",
        variant: "destructive",
      })
      return
    }

    if (!canAskQuestion()) {
      setShowLimitDialog(true)
      trackEvent(`limit_hit_${plan}` as any)
      return
    }

    setIsLoading(true)
    trackEvent(AnalyticsEvents.SOLVE_SUBMIT, { question: question.substring(0, 100), plan })

    try {
      const response = await fetch("/api/solve-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })

      if (!response.ok) throw new Error("Failed to solve question")

      const data = await response.json()
      setSolution(data.solution)
      incrementQuestions()

      toast({
        title: "Solution generated!",
        description: "Your problem has been solved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to solve the question. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTextExtracted = (extractedText: string) => {
    setQuestion(extractedText)
    setActiveTab("text")
  }

  const getPlanBadgeColor = (planType: string) => {
    switch (planType) {
      case "pro":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "standard":
        return "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
      case "mini":
        return "bg-gradient-to-r from-green-500 to-blue-500 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">EduSolver AI</h1>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Badge className={getPlanBadgeColor(plan)}>
                {plan === "pro" && <Crown className="h-3 w-3 mr-1" />}
                {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
              </Badge>

              {plan !== "pro" && (
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Questions today:</span>
                  <span className="font-semibold">
                    {questionsToday}/{currentLimit === Number.POSITIVE_INFINITY ? "∞" : currentLimit}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Ad Header */}
      <AdSlot slot="header" className="py-4" />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Usage Stats */}
        {plan !== "pro" && (
          <Card className="mb-8">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Daily Usage</CardTitle>
                  <CardDescription>
                    {remaining > 0
                      ? `${remaining} questions remaining today`
                      : "Daily limit reached. Upgrade for more questions!"}
                  </CardDescription>
                </div>
                {remaining === 0 && (
                  <Link href="/pricing">
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-teal-500">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercentage} className="h-2" />
            </CardContent>
          </Card>
        )}

        {/* Solver Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              AI Problem Solver
            </CardTitle>
            <CardDescription>
              Get instant solutions with step-by-step explanations for any math or science problem
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Type Question
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Upload Image (OCR)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter your math or science question here... 

Examples:
• Solve: 2x + 5 = 15
• What is the derivative of x²?
• Explain photosynthesis process
• Calculate the area of a circle with radius 5cm"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />

                  <Button
                    onClick={handleSolveQuestion}
                    disabled={isLoading || !question.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Solving...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Solve Question
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="image" className="space-y-4 mt-6">
                <ImageOCR onTextExtracted={handleTextExtracted} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Solution Display */}
        {solution && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-500" />
                Solution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">{solution}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inline Ad */}
        <AdSlot slot="inline" className="my-8" />

        {/* Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Tips for Better Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold">Math Problems:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Be specific with equations and variables</li>
                  <li>• Include units when relevant</li>
                  <li>• Ask for step-by-step solutions</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Science Questions:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Provide context and background</li>
                  <li>• Ask for explanations of concepts</li>
                  <li>• Request examples when helpful</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Limit Reached Dialog */}
      <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Daily Limit Reached
            </DialogTitle>
            <DialogDescription className="space-y-4">
              <p>
                You've used all {currentLimit} questions for today on the {plan.charAt(0).toUpperCase() + plan.slice(1)}{" "}
                plan.
              </p>
              <p>
                Upgrade to get more questions and unlock additional features like the video library and advanced
                analytics.
              </p>
              <div className="flex gap-2 pt-4">
                <Link href="/pricing" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-teal-500">
                    <Crown className="h-4 w-4 mr-2" />
                    View Plans
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setShowLimitDialog(false)}>
                  Maybe Later
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Sticky Ad */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <AdSlot slot="sticky" className="py-2 bg-background/95 backdrop-blur-sm border-t" />
      </div>
    </div>
  )
}
