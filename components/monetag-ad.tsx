"use client"

import { useEffect, useRef } from "react"

interface MonetagAdProps {
  className?: string
  size?: "banner" | "rectangle" | "leaderboard"
}

export function MonetagAd({ className = "", size = "banner" }: MonetagAdProps) {
  const adRef = useRef<HTMLDivElement>(null)

  const sizeClasses = {
    banner: "h-24 w-full",
    rectangle: "h-64 w-80",
    leaderboard: "h-24 w-full max-w-3xl",
  }

  useEffect(() => {
    if (adRef.current && typeof window !== "undefined") {
      const script = document.createElement("script")
      script.type = "text/javascript"
      script.src = "https://otieu.com/4/9934786"
      script.async = true
      script.setAttribute("data-cfasync", "false")

      // Clear any existing content
      adRef.current.innerHTML = ""
      adRef.current.appendChild(script)
    }
  }, [])

  return (
    <div className={`text-center ${className}`}>
      <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
      <div
        ref={adRef}
        className={`bg-muted/10 border border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center ${sizeClasses[size]} overflow-hidden`}
      >
        <span className="text-sm text-muted-foreground">Loading ad...</span>
      </div>
    </div>
  )
}
