"use client"

import { useAppStore } from "./store"
import { useEffect, useRef } from "react"

interface AdSlotProps {
  slot: "header" | "inline" | "sticky"
  className?: string
}

export function AdSlot({ slot, className = "" }: AdSlotProps) {
  const { plan } = useAppStore()
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Defer ad script loading to prevent layout shift
    const timer = setTimeout(() => {
      if (adRef.current && typeof window !== "undefined") {
        // Initialize ad based on slot type
        const adConfig = {
          header: { width: 728, height: 90 },
          inline: { width: 300, height: 250 },
          sticky: { width: 320, height: 50 },
        }

        const config = adConfig[slot]
        adRef.current.style.width = `${config.width}px`
        adRef.current.style.height = `${config.height}px`
        adRef.current.style.backgroundColor = "#f3f4f6"
        adRef.current.style.display = "flex"
        adRef.current.style.alignItems = "center"
        adRef.current.style.justifyContent = "center"
        adRef.current.style.border = "1px solid #e5e7eb"
        adRef.current.style.borderRadius = "8px"
        adRef.current.innerHTML = `<span style="color: #6b7280; font-size: 14px;">Ad ${config.width}x${config.height}</span>`
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [slot])

  if (plan === "pro") {
    return null
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <div ref={adRef} />
    </div>
  )
}
