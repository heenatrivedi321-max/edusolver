import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Brain,
  Video,
  BarChart3,
  Calendar,
  Smartphone,
  CreditCard,
  Star,
  Users,
  School,
  TrendingUp,
  ArrowRight,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">EduSolver AI</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
              Solve any question in{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">seconds</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
              Trusted by students and schools. Learn faster with AI explanations and videos.
            </p>

            {/* Social Proof Stats */}
            <div className="flex flex-wrap justify-center items-center gap-8 py-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-foreground">2M+</span>
                <span>students</span>
              </div>
              <div className="w-px h-6 bg-border hidden sm:block" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <School className="h-5 w-5 text-teal-500" />
                <span className="font-semibold text-foreground">50,000+</span>
                <span>schools</span>
              </div>
              <div className="w-px h-6 bg-border hidden sm:block" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-foreground">5,000+</span>
                <span>daily solutions</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Start Free Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/app">
                <Button size="lg" variant="outline" className="px-8 bg-transparent">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to excel</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help students learn faster and achieve better results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>AI Answers</CardTitle>
                <CardDescription>
                  Get instant, accurate solutions to any math or science problem with detailed explanations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-teal-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle>Video Library</CardTitle>
                <CardDescription>
                  Access thousands of educational videos with step-by-step tutorials and concept explanations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Performance Dashboard</CardTitle>
                <CardDescription>
                  Track your progress, identify weak areas, and monitor improvement over time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Study Plan</CardTitle>
                <CardDescription>
                  Get personalized study schedules and recommendations based on your learning goals
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Works on Any Device (PWA)</CardTitle>
                <CardDescription>
                  Install as an app on your phone, tablet, or computer for offline access and faster performance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-indigo-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Razorpay UPI</CardTitle>
                <CardDescription>
                  Secure and convenient payments with UPI, cards, and other popular payment methods
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by students everywhere</h2>
            <p className="text-xl text-muted-foreground">
              See what students and teachers are saying about EduSolver AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "EduSolver AI helped me improve my math grades from C to A+. The step-by-step explanations are
                  amazing!"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-semibold">P</span>
                  </div>
                  <div>
                    <p className="font-semibold">Priya Sharma</p>
                    <p className="text-sm text-muted-foreground">Class 12 Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "As a teacher, I recommend EduSolver AI to all my students. It's like having a personal tutor
                  available 24/7."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-200 rounded-full flex items-center justify-center">
                    <span className="text-teal-700 font-semibold">R</span>
                  </div>
                  <div>
                    <p className="font-semibold">Rajesh Kumar</p>
                    <p className="text-sm text-muted-foreground">Math Teacher</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "The video library is incredible! I finally understand calculus concepts that confused me for months."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-orange-700 font-semibold">A</span>
                  </div>
                  <div>
                    <p className="font-semibold">Ananya Patel</p>
                    <p className="text-sm text-muted-foreground">Engineering Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Start free today. Upgrade anytime.</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join millions of students who are already learning faster with EduSolver AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 bg-transparent"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold">EduSolver AI</h3>
              </div>
              <p className="text-muted-foreground">
                Solve any question in seconds with AI-powered explanations and video tutorials.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <div className="space-y-2">
                <Link href="/app" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Solver
                </Link>
                <Link href="/videos" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Video Library
                </Link>
                <Link href="/pricing" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Account</h4>
              <div className="space-y-2">
                <Link href="/login" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Sign Up
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 EduSolver AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
