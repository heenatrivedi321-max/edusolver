"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, X, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { trackEvent, AnalyticsEvents } from "./analytics"
import { useToast } from "@/hooks/use-toast"

interface ImageOCRProps {
  onTextExtracted: (text: string) => void
}

export function ImageOCR({ onTextExtracted }: ImageOCRProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState("")
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const compressImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions (max width 1600px)
        const maxWidth = 1600
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          "image/jpeg",
          0.8,
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }, [])

  const processImage = useCallback(
    async (file: File) => {
      if (file.size > 8 * 1024 * 1024) {
        setError("Image size must be less than 8MB")
        return
      }

      setIsProcessing(true)
      setProgress(0)
      setError("")
      setExtractedText("")

      trackEvent(AnalyticsEvents.OCR_STARTED, { fileSize: file.size, fileType: file.type })

      try {
        // Compress image if needed
        const processedFile = await compressImage(file)

        // Create preview
        const imageUrl = URL.createObjectURL(processedFile)
        setSelectedImage(imageUrl)
        setProgress(20)

        // Dynamic import of Tesseract.js
        const { createWorker } = await import("tesseract.js")
        setProgress(40)

        const worker = await createWorker("eng", 1, {
          logger: (m) => {
            if (m.status === "recognizing text") {
              const progressPercent = Math.round(40 + m.progress * 50)
              setProgress(progressPercent)
            }
          },
        })

        setProgress(60)

        const {
          data: { text },
        } = await worker.recognize(processedFile)
        await worker.terminate()

        setProgress(100)

        // Post-process text
        const cleanedText = text.trim()

        if (cleanedText.length < 10) {
          setError("Text too short. Please retake the image with better lighting and focus.")
          trackEvent(AnalyticsEvents.OCR_FAILED, { reason: "text_too_short", textLength: cleanedText.length })
          return
        }

        setExtractedText(cleanedText)
        trackEvent(AnalyticsEvents.OCR_COMPLETED, { textLength: cleanedText.length })

        toast({
          title: "Text extracted successfully!",
          description: "The text has been extracted from your image.",
        })
      } catch (error) {
        console.error("OCR Error:", error)
        setError("Failed to extract text from image. Please try again.")
        trackEvent(AnalyticsEvents.OCR_FAILED, { error: String(error) })
      } finally {
        setIsProcessing(false)
        setProgress(0)
      }
    },
    [compressImage, toast],
  )

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file && file.type.startsWith("image/")) {
        processImage(file)
      }
    },
    [processImage],
  )

  const handleUseText = () => {
    if (extractedText) {
      onTextExtracted(extractedText)
      trackEvent(AnalyticsEvents.SOLVE_FROM_IMAGE_CLICKED, { textLength: extractedText.length })
      toast({
        title: "Text added to solver",
        description: "The extracted text has been added to the question field.",
      })
    }
  }

  const handleCancel = () => {
    setIsProcessing(false)
    setProgress(0)
    setSelectedImage(null)
    setExtractedText("")
    setError("")
  }

  const handleRetake = () => {
    setSelectedImage(null)
    setExtractedText("")
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-6">
      {!selectedImage && !isProcessing && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Upload from Gallery */}
          <Card className="border-2 border-dashed border-border hover:border-blue-300 transition-colors cursor-pointer">
            <CardContent className="p-8 text-center" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload from Gallery</h3>
              <p className="text-muted-foreground mb-4">Select an image from your device</p>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </CardContent>
          </Card>

          {/* Take Photo */}
          <Card className="border-2 border-dashed border-border hover:border-blue-300 transition-colors cursor-pointer">
            <CardContent className="p-8 text-center" onClick={() => cameraInputRef.current?.click()}>
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Take Photo</h3>
              <p className="text-muted-foreground mb-4">Use your camera to capture the problem</p>
              <Button variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Open Camera
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
              <h3 className="text-lg font-semibold">Processing Image...</h3>
              <p className="text-muted-foreground">Extracting text from your image using OCR technology</p>
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">{progress}% complete</p>
              </div>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Preview */}
      {selectedImage && !isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Image Preview</h3>
                <Button variant="outline" size="sm" onClick={handleRetake}>
                  <Camera className="h-4 w-4 mr-2" />
                  Retake
                </Button>
              </div>
              <div className="max-w-md mx-auto">
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="Selected image"
                  className="w-full h-auto rounded-lg border"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Error</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Text */}
      {extractedText && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <h3 className="font-semibold">Text Extracted Successfully</h3>
              </div>

              <div className="bg-white p-4 rounded-lg border max-h-40 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap">{extractedText}</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUseText} className="flex-1">
                  Use This Text
                </Button>
                <Button variant="outline" onClick={handleRetake}>
                  Retake Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden File Inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Tips */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Tips for Better OCR Results</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Image Quality:</h4>
              <ul className="space-y-1">
                <li>• Ensure good lighting</li>
                <li>• Keep the image in focus</li>
                <li>• Avoid shadows and glare</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Text Positioning:</h4>
              <ul className="space-y-1">
                <li>• Keep text horizontal</li>
                <li>• Fill the frame with the problem</li>
                <li>• Use high contrast backgrounds</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
