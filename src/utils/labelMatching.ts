import { RuleType } from "@/options/constants"
import { Label, Options, Rule } from "@/options/types"

export interface LabelMatch {
  label: Label
  rule: Rule
}

/**
 * Check if a URL is a Chrome internal URL or empty
 * @param url The URL to check
 * @returns true if the URL is empty, chrome://, or chrome-extension://
 */
export function isChromeUrl(url: string): boolean {
  if (!url || url.trim() === "") {
    return true
  }
  return url.startsWith("chrome://") || url.startsWith("chrome-extension://")
}

/**
 * Get the comparison string from a URL based on the source type
 * @param url The full URL string
 * @param source The source type: "hostname" (default) or "fullUrl"
 * @returns The string to use for rule matching
 */
export function getComparisonString(
  url: string,
  source?: "hostname" | "fullUrl"
): string {
  try {
    // For fullUrl source, return URL without protocol
    if (source === "fullUrl") {
      return url.replace(/^https?:\/\//, "")
    }

    // For hostname source (default), extract hostname from URL
    // Handle URLs that might not have a protocol
    const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`
    const urlObj = new URL(urlWithProtocol)
    return urlObj.hostname
  } catch (e) {
    console.error("Failed to parse URL:", url, e)
    return ""
  }
}

/**
 * Check if a string matches a rule
 * @param ruleType The type of rule (matches, startsWith, endsWith, contains, regexp)
 * @param ruleValue The value to match against
 * @param str The string to test
 * @returns true if the string matches the rule
 */
export function checkRule(
  ruleType: RuleType,
  ruleValue: string,
  str: string
): boolean {
  switch (ruleType) {
    case "matches":
      return str == ruleValue
    case "startsWith":
      return str.startsWith(ruleValue)
    case "endsWith":
      return str.endsWith(ruleValue)
    case "contains":
      return str.includes(ruleValue)
    case "regexp":
      try {
        const regex = new RegExp(ruleValue)
        return regex.test(str)
      } catch (e) {
        console.error("Invalid regexp pattern:", ruleValue, e)
        return false
      }
    default:
      return false
  }
}

/**
 * Find the first label that matches the given URL
 * @param options The application options containing labels and rules
 * @param url The URL to match against
 * @param checkGlobalActive Whether to check if the extension is globally active (default: true)
 * @param checkLabelActive Whether to check if individual labels are active (default: true)
 * @returns The first matching label, or null if no match is found
 */
export function matchLabel(
  options: Options,
  url: string,
  checkGlobalActive: boolean = true,
  checkLabelActive: boolean = true
): Label | null {
  // Validate options
  if (!Array.isArray(options?.labels) || options?.labels?.length === 0) {
    return null
  }

  if (checkGlobalActive && options?.isActive !== true) {
    return null
  }

  for (const label of options.labels) {
    if (checkLabelActive && !label.isActive) {
      continue
    }

    for (const rule of label.rules) {
      const comparisonString = getComparisonString(url, rule.source)
      if (checkRule(rule.type, rule.value, comparisonString)) {
        return label
      }
    }
  }

  return null
}

/**
 * Find the first label that matches the given URL, along with the matched rule
 * @param options The application options containing labels and rules
 * @param url The URL to match against
 * @param checkGlobalActive Whether to check if the extension is globally active (default: true)
 * @param checkLabelActive Whether to check if individual labels are active (default: true)
 * @returns An object containing the matching label and rule, or null if no match is found
 */
export function matchLabelWithRule(
  options: Options,
  url: string,
  checkGlobalActive: boolean = true,
  checkLabelActive: boolean = true
): LabelMatch | null {
  // Validate options
  if (!Array.isArray(options?.labels) || options?.labels?.length === 0) {
    return null
  }

  if (checkGlobalActive && options?.isActive !== true) {
    return null
  }

  for (const label of options.labels) {
    if (checkLabelActive && !label.isActive) {
      continue
    }

    for (const rule of label.rules) {
      const comparisonString = getComparisonString(url, rule.source)
      if (checkRule(rule.type, rule.value, comparisonString)) {
        return { label, rule }
      }
    }
  }

  return null
}
