import type { Label } from "@/options/types"

export interface LabelBadgeProps {
  label: Label | null
  size?: "xs" | "sm" | "md"
  p?: number
  fallbackText?: string
}
