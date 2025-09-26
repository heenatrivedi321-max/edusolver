"use client"

interface MonetagAdProps {
  className?: string
  size?: "banner" | "rectangle" | "leaderboard"
}

export function MonetagAd({ className = "", size = "banner" }: MonetagAdProps) {
  const sizeClasses = {
    banner: "h-24 w-full",
    rectangle: "h-64 w-80",
    leaderboard: "h-24 w-full max-w-3xl",
  }

  return (
    <div className={`text-center ${className}`}>
      <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
      <div
        className={`bg-muted/30 border border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center ${sizeClasses[size]}`}
      >
        <span className="text-sm text-muted-foreground">Monetag Ad Space</span>
        https://otieu.com/4/9934786
      </div>
    </div>
  )
}
