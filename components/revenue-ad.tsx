import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Sparkles } from "lucide-react"

interface RevenueAdProps {
  size?: "small" | "medium" | "large"
  className?: string
}

export function RevenueAd({ size = "medium", className = "" }: RevenueAdProps) {
  const sizeClasses = {
    small: "p-4",
    medium: "p-6",
    large: "p-8",
  }

  const textSizes = {
    small: { title: "text-sm", desc: "text-xs" },
    medium: { title: "text-base", desc: "text-sm" },
    large: { title: "text-lg", desc: "text-base" },
  }

  return (
    <Card
      className={`bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 ${className}`}
    >
      <CardContent className={`text-center ${sizeClasses[size]}`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Sponsored</span>
        </div>

        <h3 className={`font-semibold text-gray-900 dark:text-gray-100 mb-2 ${textSizes[size].title}`}>
          Master Math with AI Tutoring
        </h3>

        <p className={`text-gray-600 dark:text-gray-400 mb-4 ${textSizes[size].desc}`}>
          Personalized learning paths, instant feedback, and 24/7 AI support for students of all levels.
        </p>

        <Button size={size === "small" ? "sm" : "default"} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          Try Free Trial
          <ExternalLink className="h-3 w-3" />
        </Button>

        <p className="text-xs text-gray-500 mt-2">No credit card required • 7-day free trial</p>
      </CardContent>
    </Card>
  )
}
