"use client"

// Analytics event tracking
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== "undefined") {
    console.log(`[Analytics] ${eventName}`, properties)
    // In production, this would send to your analytics service
  }
}

export const AnalyticsEvents = {
  SIGNUP: "signup",
  SOLVE_SUBMIT: "solve_submit",
  LIMIT_HIT_FREE: "limit_hit_free",
  LIMIT_HIT_MINI: "limit_hit_mini",
  LIMIT_HIT_STANDARD: "limit_hit_standard",
  POPUP_SHOWN: "popup_shown",
  UPGRADE_CLICKED_MINI: "upgrade_clicked_mini",
  UPGRADE_CLICKED_STANDARD: "upgrade_clicked_standard",
  UPGRADE_CLICKED_PRO: "upgrade_clicked_pro",
  PAYMENT_SUCCESS: "payment_success",
  OCR_STARTED: "ocr_started",
  OCR_COMPLETED: "ocr_completed",
  OCR_FAILED: "ocr_failed",
  SOLVE_FROM_IMAGE_CLICKED: "solve_from_image_clicked",
}
