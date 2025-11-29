import { UPDATE_FREQUENCIES } from "../constants.ts";

/**
 * Format timestamp as relative time (e.g., "2 min ago", "1 hour ago")
 * Falls back to absolute date if older than 7 days
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  // If timestamp is in the future or invalid, return absolute date
  if (diff < 0 || isNaN(diff)) {
    return new Date(timestamp).toLocaleString();
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Just now (less than 1 minute)
  if (seconds < 60) {
    return "just now";
  }

  // Minutes ago (1-59 minutes)
  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }

  // Hours ago (1-23 hours)
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  // Days ago (1-7 days)
  if (days <= 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  // Older than 7 days - show absolute date
  return new Date(timestamp).toLocaleString();
}

/**
 * Format update frequency in minutes to human-readable string
 */
export const formatUpdateFrequency = (minutes: number): string =>
  UPDATE_FREQUENCIES.find((i) => parseInt(i.value) === minutes)?.label ||
  `Every ${minutes} min`;
