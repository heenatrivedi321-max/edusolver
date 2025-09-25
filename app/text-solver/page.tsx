"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, ArrowLeft, Loader2, BookOpen, Lightbulb, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { GoogleAd } from "@/components/google-ad"

interface Solution {
  method: string
  steps: string[]
  answer: string
  explanation: string
}

export default function TextSolverPage() {
  const [problem, setProblem] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const { toast } = useToast()

  const handleSolve = async () => {
    if (!problem.trim()) {
      toast({
        title: "Please enter a problem",
        description: "Type your math or science problem to get started.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setSolutions([])

    try {
      const response = await fetch("/api/solve-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problem }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          fullResponse += chunk

          // Parse the AI response and update solutions in real-time
          const parsedSolutions = parseAIResponse(fullResponse)
          setSolutions(parsedSolutions)
        }
      }
    } catch (error) {
      console.error("Error solving problem:", error)
      toast({
        title: "Error solving problem",
        description: "Please try again or check your internet connection.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const parseAIResponse = (response: string): Solution[] => {
    // Simple parsing - in a real app, you might want more sophisticated parsing
    const solutions: Solution[] = []

    // Try to extract answer, solution steps, and alternative method from AI response
    const answerMatch = response.match(/Answer:\s*(.+?)(?=\n|$)/i)
    const answer = answerMatch ? answerMatch[1].trim() : "Processing..."

    // Split response into sections
    const sections = response.split(/(?:Solution:|Alternative Method:)/i)

    if (sections.length >= 2) {
      // Main solution
      const mainSolution = sections[1]?.trim() || ""
      const steps = mainSolution
        .split("\n")
        .filter((line) => line.trim())
        .slice(0, 5)

      solutions.push({
        method: "AI Solution",
        steps: steps.length > 0 ? steps : ["Analyzing problem...", "Processing with AI...", "Generating solution..."],
        answer: answer,
        explanation: "Solution generated using advanced AI reasoning and mathematical analysis.",
      })
    }

    if (sections.length >= 3) {
      // Alternative method
      const altSolution = sections[2]?.trim() || ""
      const altSteps = altSolution
        .split("\n")
        .filter((line) => line.trim())
        .slice(0, 5)

      solutions.push({
        method: "Alternative Method",
        steps:
          altSteps.length > 0
            ? altSteps
            : ["Exploring alternative approach...", "Applying different methodology...", "Verifying results..."],
        answer: answer,
        explanation: "Alternative approach to verify and provide different perspective on the solution.",
      })
    }

    // If no structured response yet, show loading solution
    if (solutions.length === 0) {
      solutions.push({
        method: "AI Analysis",
        steps: [
          "Processing your problem...",
          "Applying mathematical principles...",
          "Generating step-by-step solution...",
        ],
        answer: "Calculating...",
        explanation: "AI is analyzing your problem and generating a comprehensive solution.",
      })
    }

    return solutions
  }

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      toast({
        title: "Copied to clipboard",
        description: "Solution has been copied to your clipboard.",
      })
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Calculator className="h-6 w-6 text-accent" />
                <h1 className="text-xl font-bold text-foreground">EduSolver Text</h1>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <BookOpen className="h-3 w-3" />
              Text Mode
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                Enter Your Problem
              </CardTitle>
              <CardDescription>
                Type any mathematical equation or science problem. Be as detailed as possible for better results.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Example: Solve for x: 2x + 5 = 13&#10;Or: Calculate the velocity of an object falling from 100m height"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSolve}
                  disabled={isLoading || !problem.trim()}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Solving...
                    </>
                  ) : (
                    "Solve Problem"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setProblem("")
                    setSolutions([])
                  }}
                  disabled={isLoading}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ad Space */}
          <GoogleAd adSlot="2468135790" adFormat="rectangle" />

          {/* Solutions Section */}
          {solutions.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-accent" />
                <h2 className="text-2xl font-bold">Solutions & Methods</h2>
              </div>

              {solutions.map((solution, index) => (
                <Card key={index} className="border-l-4 border-l-accent">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{solution.method}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            `${solution.method}\n\nSteps:\n${solution.steps.join("\n")}\n\nAnswer: ${solution.answer}\n\nExplanation: ${solution.explanation}`,
                            index,
                          )
                        }
                        className="gap-2"
                      >
                        {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        Copy
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Step-by-Step Solution:</h4>
                      <ol className="space-y-2">
                        {solution.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex gap-3">
                            <Badge
                              variant="outline"
                              className="min-w-[24px] h-6 rounded-full p-0 flex items-center justify-center text-xs"
                            >
                              {stepIndex + 1}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <Separator />

                    <div className="bg-accent/5 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-accent">Final Answer:</h4>
                      <p className="text-lg font-mono bg-background border rounded px-3 py-2">{solution.answer}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Explanation:</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{solution.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent" />
                  <div>
                    <p className="font-medium">Analyzing your problem...</p>
                    <p className="text-sm text-muted-foreground">
                      Our AI is working on finding the best solutions and methods
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
