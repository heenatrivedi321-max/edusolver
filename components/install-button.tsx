"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Smartphone } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setDeferredPrompt(null)
        setIsInstallable(false)
      }
    } else {
      setShowInstructions(!showInstructions)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={handleInstall}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
      >
        <Download className="w-5 h-5 mr-2" />
        Download Now
      </Button>

      {showInstructions && !isInstallable && (
        <div className="bg-card border border-border rounded-lg p-4 max-w-md text-sm">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-4 h-4 text-accent" />
            <span className="font-semibold">Install Instructions:</span>
          </div>
          <div className="space-y-2 text-muted-foreground">
            <p>
              <strong>Chrome/Edge:</strong> Click menu (⋮) → "Install EduSolver"
            </p>
            <p>
              <strong>Safari:</strong> Share button → "Add to Home Screen"
            </p>
            <p>
              <strong>Firefox:</strong> Address bar → Install icon
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
