import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json()

    if (!question) {
      return new Response("Question is required", { status: 400 })
    }

    const result = await generateText({
      model: xai("grok-4"),
      prompt: `Solve this math/science problem: ${question}`,
      system: `You are an expert math and science tutor. When given a problem:
1. First, provide the final answer clearly
2. Then show the step-by-step solution
3. Finally, provide at least one alternative method to solve the same problem
4. Use clear formatting with headers like "Answer:", "Solution:", and "Alternative Method:"
5. Explain each step clearly for educational purposes
6. Keep explanations concise but thorough`,
    })

    return Response.json({ solution: result.text })
  } catch (error) {
    console.error("Error solving problem:", error)
    return new Response("Failed to solve problem", { status: 500 })
  }
}
