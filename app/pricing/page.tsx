"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Check, X, ArrowLeft, Zap, Video, BarChart3 } from "lucide-react"
import { useAppStore } from "@/components/store"
import { trackEvent, AnalyticsEvents } from "@/components/analytics"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PricingPage() {
  const { plan, setPlan } = useAppStore()
  const { toast } = useToast()

  const handlePayment = async (planType: "mini" | "standard" | "pro", amount: number) => {
    // Check if Razorpay environment variables are available
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const planId = process.env[`NEXT_PUBLIC_RZP_PLAN_${planType.toUpperCase()}` as keyof typeof process.env]

    if (!keyId || !planId) {
      // Show demo banner if envs missing
      toast({
        title: "Demo Mode",
        description: "Razorpay integration not configured. This is a demo.",
        variant: "default",
      })

      // Simulate successful payment for demo
      setTimeout(() => {
        setPlan(planType)
        trackEvent(AnalyticsEvents.PAYMENT_SUCCESS, { plan: planType, amount })
        toast({
          title: "Payment Successful!",
          description: `You've been upgraded to ${planType} plan.`,
        })
      }, 1000)
      return
    }

    trackEvent(`upgrade_clicked_${planType}` as any, { plan: planType, amount })

    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      const options = {
        key: keyId,
        amount: amount * 100, // Convert to paise
        currency: "INR",
        name: "EduSolver AI",
        description: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan Subscription`,
        subscription_id: planId,
        handler: (response: any) => {
          // Payment successful
          setPlan(planType)
          trackEvent(AnalyticsEvents.PAYMENT_SUCCESS, {
            plan: planType,
            amount,
            payment_id: response.razorpay_payment_id,
          })
          toast({
            title: "Payment Successful!",
            description: `You've been upgraded to ${planType} plan.`,
          })
        },
        prefill: {
          name: "Student",
          email: "student@example.com",
        },
        theme: {
          color: "#5B7CFA",
        },
        modal: {
          ondismiss: () => {
            trackEvent("payment_cancelled", { plan: planType })
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    }
  }

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "forever",
      description: "Perfect for trying out EduSolver AI",
      features: ["5 questions per day", "Basic AI explanations", "Text input only", "Community support"],
      limitations: ["Ads included", "No video library", "Limited features"],
      buttonText: plan === "free" ? "Current Plan" : "Get Started",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      id: "mini",
      name: "Mini",
      price: 5,
      period: "month",
      description: "Great for regular students",
      features: [
        "50 questions per day",
        "Advanced AI explanations",
        "Text + Image input",
        "Priority support",
        "Basic analytics",
      ],
      limitations: ["Ads included", "No video library"],
      buttonText: plan === "mini" ? "Current Plan" : "Upgrade to Mini",
      buttonVariant: "default" as const,
      popular: false,
    },
    {
      id: "standard",
      name: "Standard",
      price: 59,
      period: "month",
      description: "Best for serious learners",
      features: [
        "50 questions per day",
        "Advanced AI explanations",
        "Text + Image input",
        "Video Library access",
        "Detailed analytics",
        "Study plans",
        "Priority support",
      ],
      limitations: ["Ads included"],
      buttonText: plan === "standard" ? "Current Plan" : "Upgrade to Standard",
      buttonVariant: "default" as const,
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: 99,
      period: "month",
      description: "Ultimate learning experience",
      features: [
        "Unlimited questions",
        "Advanced AI explanations",
        "Text + Image input",
        "Full Video Library",
        "Advanced analytics",
        "Personalized study plans",
        "Premium support",
        "No ads",
        "Offline access",
      ],
      limitations: [],
      buttonText: plan === "pro" ? "Current Plan" : "Upgrade to Pro",
      buttonVariant: "default" as const,
      popular: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">EduSolver AI</h1>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose your learning plan</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade anytime. All plans include our core AI-powered problem solving.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((planItem) => (
              <Card
                key={planItem.id}
                className={`relative border-2 transition-all duration-200 hover:shadow-lg ${
                  planItem.popular ? "border-blue-500 shadow-lg scale-105" : "border-border hover:border-blue-200"
                } ${plan === planItem.id ? "ring-2 ring-blue-500" : ""}`}
              >
                {planItem.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{planItem.name}</CardTitle>
                  <div className="py-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">₹{planItem.price}</span>
                      {planItem.price > 0 && <span className="text-muted-foreground">/{planItem.period}</span>}
                    </div>
                  </div>
                  <CardDescription className="text-base">{planItem.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {planItem.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {planItem.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center gap-3 opacity-60">
                        <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <Button
                    className="w-full"
                    variant={planItem.buttonVariant}
                    disabled={plan === planItem.id}
                    onClick={() => {
                      if (planItem.id === "free") {
                        setPlan("free")
                        toast({
                          title: "Plan Updated",
                          description: "You're now on the Free plan.",
                        })
                      } else {
                        handlePayment(planItem.id as "mini" | "standard" | "pro", planItem.price)
                      }
                    }}
                  >
                    {planItem.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Compare all features</h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>AI-Powered Solutions</CardTitle>
                  <CardDescription>
                    Get instant, accurate answers to any math or science problem with detailed step-by-step explanations
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Video className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle>Video Library</CardTitle>
                  <CardDescription>
                    Access thousands of educational videos with concept explanations and tutorials (Standard & Pro
                    plans)
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>
                    Monitor your learning progress, identify weak areas, and get personalized recommendations
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I change my plan anytime?</CardTitle>
                  <CardDescription>
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                  <CardDescription>
                    We accept all major payment methods through Razorpay including UPI, credit/debit cards, net banking,
                    and digital wallets.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a free trial?</CardTitle>
                  <CardDescription>
                    Yes! Our Free plan gives you 5 questions per day forever. No credit card required to get started.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
