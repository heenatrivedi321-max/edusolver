import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { problem } = await request.json()

    if (!problem) {
      return new Response("Problem is required", { status: 400 })
    }

    const result = streamText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: `Solve this math/science problem: ${problem}`,
      system: `You are an expert math and science tutor. When given a problem:
1. First, provide the final answer clearly
2. Then show the step-by-step solution
3. Finally, provide at least one alternative method to solve the same problem
4. Use clear formatting with headers like "Answer:", "Solution:", and "Alternative Method:"
5. Explain each step clearly for educational purposes`,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error solving problem:", error)
    return new Response("Failed to solve problem", { status: 500 })
  }
}
