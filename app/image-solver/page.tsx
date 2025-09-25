"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, ArrowLeft, Loader2, Camera, Upload, X, Lightbulb, Copy, Check, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { GoogleAd } from "@/components/google-ad"

interface Solution {
  method: string
  steps: string[]
  answer: string
  explanation: string
}

export default function ImageSolverPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImageSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, etc.)",
        variant: "destructive",
      })
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setSolutions([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSolve = async () => {
    if (!selectedImage) {
      toast({
        title: "Please select an image",
        description: "Upload an image of your math or science problem to get started.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setSolutions([])

    try {
      // Convert image to base64 for API
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string

        const response = await fetch("/api/solve-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl }),
        })

        if (!response.ok) {
          throw new Error("Failed to process image")
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

        setIsLoading(false)
      }

      reader.onerror = () => {
        throw new Error("Failed to read image file")
      }

      reader.readAsDataURL(selectedImage)
    } catch (error) {
      console.error("Error processing image:", error)
      toast({
        title: "Error processing image",
        description: "Please try again with a clearer image or check your internet connection.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const parseAIResponse = (response: string): Solution[] => {
    const solutions: Solution[] = []

    // Try to extract problems identified, answer, and solution from AI response
    const problemsMatch = response.match(/Problems Identified:\s*(.+?)(?=Answer:|Solution:|$)/is)
    const answerMatch = response.match(/Answer:\s*(.+?)(?=\n|Solution:|Alternative Method:|$)/i)
    const answer = answerMatch ? answerMatch[1].trim() : "Processing..."

    // Split response into sections
    const sections = response.split(/(?:Solution:|Alternative Method:)/i)

    if (sections.length >= 2) {
      // Main solution
      const mainSolution = sections[1]?.trim() || ""
      const steps = mainSolution
        .split("\n")
        .filter((line) => line.trim())
        .slice(0, 6)

      solutions.push({
        method: "AI Image Analysis",
        steps:
          steps.length > 0
            ? steps
            : [
                "Analyzing image content...",
                "Extracting mathematical expressions...",
                "Processing with OCR...",
                "Applying solution methods...",
              ],
        answer: answer,
        explanation:
          "Solution generated by analyzing the uploaded image using advanced AI vision and mathematical reasoning.",
      })
    }

    if (sections.length >= 3) {
      // Alternative method
      const altSolution = sections[2]?.trim() || ""
      const altSteps = altSolution
        .split("\n")
        .filter((line) => line.trim())
        .slice(0, 6)

      solutions.push({
        method: "Alternative Approach",
        steps:
          altSteps.length > 0
            ? altSteps
            : [
                "Re-analyzing image data...",
                "Applying different methodology...",
                "Cross-referencing solutions...",
                "Verifying accuracy...",
              ],
        answer: answer,
        explanation:
          "Alternative solution method to provide verification and different perspective on the image-based problem.",
      })
    }

    // If no structured response yet, show loading solution
    if (solutions.length === 0) {
      solutions.push({
        method: "Image Processing",
        steps: [
          "Scanning image content...",
          "Identifying mathematical elements...",
          "Extracting text and equations...",
          "Generating comprehensive solution...",
        ],
        answer: "Analyzing...",
        explanation: "AI is processing your image and extracting mathematical content for analysis.",
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
                <h1 className="text-xl font-bold text-foreground">EduSolver Image</h1>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Camera className="h-3 w-3" />
              Image Mode
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-accent" />
                Upload Your Problem
              </CardTitle>
              <CardDescription>
                Upload a clear image of your mathematical equation or science problem. Supports PNG, JPG, JPEG, and
                other image formats.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!imagePreview ? (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent/50 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-4">
                    <div className="mx-auto p-4 bg-accent/10 rounded-full w-fit">
                      <Upload className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">Drop your image here or click to browse</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Supports PNG, JPG, JPEG, and other image formats
                      </p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative border rounded-lg overflow-hidden bg-muted/20">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Uploaded problem"
                      width={600}
                      height={400}
                      className="w-full h-auto max-h-96 object-contain"
                    />
                    <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSolve}
                      disabled={isLoading}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Processing Image...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Solve from Image
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={removeImage} disabled={isLoading}>
                      Remove Image
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ad Space */}
          <GoogleAd adSlot="1357924680" adFormat="rectangle" />

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
                    <p className="font-medium">Processing your image...</p>
                    <p className="text-sm text-muted-foreground">
                      Using OCR to extract text and analyzing the mathematical content
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips Section */}
          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-5 w-5 text-accent" />
                Tips for Better Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  Ensure the image is clear and well-lit
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  Make sure the text is readable and not blurry
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  Avoid shadows or reflections on the paper
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  Crop the image to focus on the problem area
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
