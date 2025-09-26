import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "EduSolver - AI-Powered Math & Science Problem Solver",
  description:
    "Solve mathematical equations and science problems instantly with AI. Get step-by-step solutions and alternative methods.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="monetag" content="214e6bc6cc5675096a3ea9127ecaa230" />
        <script src="https://fpyf8.com/88/tag.min.js" data-zone="173803" async data-cfasync="false" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
