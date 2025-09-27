import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Camera, Zap, BookOpen } from "lucide-react"
import { MonetagAd } from "@/components/monetag-ad"
import { InstallButton } from "@/components/install-button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-8 w-8 text-accent" />
              <h1 className="text-2xl font-bold text-foreground">EduSolver</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>AI-Powered Solutions</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Solve Math & Science Problems
              <span className="text-accent"> Instantly</span>
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Get step-by-step solutions and alternative methods for any mathematical equation or science problem using
              advanced AI.
            </p>
          </div>

          {/* Input Options */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link href="/text-solver">
              <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-accent/50">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-accent/10 rounded-full w-fit group-hover:bg-accent/20 transition-colors">
                    <BookOpen className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Text Input</CardTitle>
                  <CardDescription>Type your math or science problem directly</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Start Solving with Text
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/image-solver">
              <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-accent/50">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-accent/10 rounded-full w-fit group-hover:bg-accent/20 transition-colors">
                    <Camera className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Image Upload</CardTitle>
                  <CardDescription>Upload a photo of your problem or equation</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Start Solving with Image
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="mt-12 space-y-6">
            <MonetagAd size="rectangle" className="max-w-2xl mx-auto" />
            <MonetagAd size="leaderboard" className="max-w-4xl mx-auto" />
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="text-center space-y-2">
              <div className="mx-auto p-3 bg-accent/10 rounded-full w-fit">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold">Instant Solutions</h3>
              <p className="text-sm text-muted-foreground">Get answers in seconds with AI-powered problem solving</p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto p-3 bg-accent/10 rounded-full w-fit">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold">Step-by-Step</h3>
              <p className="text-sm text-muted-foreground">Understand the process with detailed explanations</p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto p-3 bg-accent/10 rounded-full w-fit">
                <Calculator className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold">Multiple Methods</h3>
              <p className="text-sm text-muted-foreground">Learn different approaches to solve the same problem</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/30 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Get EduSolver on Your Device</h3>
              <p className="text-sm text-muted-foreground">Install our app for offline access and faster performance</p>
            </div>
            <InstallButton />
          </div>
        </div>
      </footer>
    </div>
  )
}
