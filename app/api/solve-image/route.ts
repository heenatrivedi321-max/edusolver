import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, additionalContext } = await request.json()

    if (!imageUrl) {
      return new Response("Image URL is required", { status: 400 })
    }

    const result = streamText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image and solve any math or science problems you can identify. ${additionalContext ? `Additional context: ${additionalContext}` : ""}`,
            },
            {
              type: "image",
              image: imageUrl,
            },
          ],
        },
      ],
      system: `You are an expert math and science tutor. When analyzing an image with problems:
1. First, identify what problems or equations you can see in the image
2. Provide the final answer(s) clearly
3. Show the step-by-step solution for each problem
4. Provide at least one alternative method to solve each problem
5. Use clear formatting with headers like "Problems Identified:", "Answer:", "Solution:", and "Alternative Method:"
6. If the image is unclear, ask for clarification or provide your best interpretation`,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error solving image problem:", error)
    return new Response("Failed to solve image problem", { status: 500 })
  }
}
