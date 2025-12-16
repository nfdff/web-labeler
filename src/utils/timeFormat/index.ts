import { TranslationFunction } from "@/i18n"
import { UPDATE_FREQUENCIES } from "@/utils/constants.ts"

/**
 * Format timestamp as relative time (e.g., "2 min ago", "1 hour ago")
 * Falls back to absolute date if older than 7 days
 */
export function getRelativeTime(
  timestamp: number,
  t: TranslationFunction
): string {
  const now = Date.now()
  const diff = now - timestamp

  // If timestamp is in the future or invalid, return absolute date
  if (diff < 0 || isNaN(diff)) {
    return new Date(timestamp).toLocaleString()
  }

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  // Just now (less than 1 minute)
  if (seconds < 60) {
    return t("relativeTime_justNow")
  }

  // Minutes ago (1-59 minutes)
  if (minutes < 60) {
    return minutes === 1
      ? t("relativeTime_minutesAgo", [String(minutes)])
      : t("relativeTime_minutesAgo_plural", [String(minutes)])
  }

  // Hours ago (1-23 hours)
  if (hours < 24) {
    return hours === 1
      ? t("relativeTime_hoursAgo", [String(hours)])
      : t("relativeTime_hoursAgo_plural", [String(hours)])
  }

  // Days ago (1-7 days)
  if (days <= 7) {
    return days === 1
      ? t("relativeTime_daysAgo", [String(days)])
      : t("relativeTime_daysAgo_plural", [String(days)])
  }

  // Older than 7 days - show absolute date
  return new Date(timestamp).toLocaleString()
}

/**
 * Format update frequency in minutes to human-readable string
 */
export const formatUpdateFrequency = (
  minutes: number,
  t: TranslationFunction
): string => {
  const freq = UPDATE_FREQUENCIES.find((i) => parseInt(i.value) === minutes)
  return freq ? t(freq.labelKey) : `Every ${minutes} min`
}
