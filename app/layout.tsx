import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "EduSolver AI - Solve any question in seconds",
  description: "Trusted by students and schools. Learn faster with AI explanations and videos.",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#5B7CFA",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: "/icon-192.jpg",
    apple: "/icon-512.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
