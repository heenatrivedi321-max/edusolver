"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Plan = "free" | "mini" | "standard" | "pro"

interface AppState {
  plan: Plan
  questionsToday: number
  resetAt: string
  setPlan: (plan: Plan) => void
  incrementQuestions: () => void
  resetQuestions: () => void
  getRemainingQuestions: () => number
  canAskQuestion: () => boolean
}

const PLAN_LIMITS = {
  free: 5,
  mini: 50,
  standard: 50,
  pro: Number.POSITIVE_INFINITY,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      plan: "free",
      questionsToday: 0,
      resetAt: new Date().toDateString(),

      setPlan: (plan: Plan) => set({ plan }),

      incrementQuestions: () => {
        const state = get()
        const today = new Date().toDateString()

        // Reset if new day
        if (state.resetAt !== today) {
          set({ questionsToday: 1, resetAt: today })
        } else {
          set({ questionsToday: state.questionsToday + 1 })
        }
      },

      resetQuestions: () => {
        const today = new Date().toDateString()
        set({ questionsToday: 0, resetAt: today })
      },

      getRemainingQuestions: () => {
        const state = get()
        const today = new Date().toDateString()

        // Reset if new day
        if (state.resetAt !== today) {
          return PLAN_LIMITS[state.plan]
        }

        const limit = PLAN_LIMITS[state.plan]
        return limit === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : Math.max(0, limit - state.questionsToday)
      },

      canAskQuestion: () => {
        const remaining = get().getRemainingQuestions()
        return remaining > 0
      },
    }),
    {
      name: "edusolver-store",
    },
  ),
)
