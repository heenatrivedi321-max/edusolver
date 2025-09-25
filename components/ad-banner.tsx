import { Button } from "@/components/ui/button"
import { Zap, Crown, Star } from "lucide-react"

interface AdBannerProps {
  variant?: "homepage" | "solver" | "premium"
  className?: string
}

export function AdBanner({ variant = "homepage", className = "" }: AdBannerProps) {
  const adContent = {
    homepage: {
      title: "Premium Features Coming Soon!",
      description: "Get unlimited solutions, detailed explanations, and priority support",
      gradient: "from-accent/20 to-primary/20",
      icon: <Zap className="h-5 w-5" />,
    },
    solver: {
      title: "Get Premium Access",
      description: "Unlock advanced features and unlimited problem solving",
      gradient: "from-accent/10 to-primary/10",
      icon: <Crown className="h-4 w-4" />,
    },
    premium: {
      title: "Advanced OCR Technology",
      description: "Upgrade for better image recognition and handwriting support",
      gradient: "from-accent/15 to-primary/15",
      icon: <Star className="h-4 w-4" />,
    },
  }

  const content = adContent[variant]

  return (
    <div className={`bg-muted/30 border border-border rounded-lg p-6 text-center ${className}`}>
      <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
      <div className={`bg-gradient-to-r ${content.gradient} rounded-md p-4`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          {content.icon}
          <p className="text-sm font-medium text-foreground">{content.title}</p>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{content.description}</p>
        <Button size="sm" variant="outline" className="text-xs bg-transparent">
          Learn More
        </Button>
      </div>
    </div>
  )
}
