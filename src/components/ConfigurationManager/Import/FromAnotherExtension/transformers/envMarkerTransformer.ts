import {
  Position,
  Shape,
  colorSwatches,
} from "../../../../../options/constants.ts"
import { Label, Rule } from "../../../../../options/types.ts"
import { EnvMarkerLabel } from "../types.ts"

export function transformEnvMarkerToLabels(
  envMarkerData: EnvMarkerLabel[]
): Label[] {
  return envMarkerData.map(transformSingleLabel)
}

function transformSingleLabel(envMarker: EnvMarkerLabel): Label {
  return {
    id: envMarker.uuid,
    name: envMarker.name,
    bgColor: rgbaToHex(envMarker.color),
    textColor: colorSwatches[colorSwatches.length - 1],
    opacity: 0.75,
    hoveredOpacity: 0.5,
    fontSize: calculateFontSize(),
    scale: calculateScale(envMarker.fontSize),
    shape: mapShape(envMarker.position),
    position: mapPosition(envMarker.position),
    rules: [createRuleFromAddress(envMarker.address)],
    isActive: true,
    iconStyle: "badge",
    iconOnly: false,
  }
}

function rgbaToHex(rgba: string): string {
  try {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
    if (!match) {
      return colorSwatches[0] // Fallback to default red
    }

    const r = parseInt(match[1], 10)
    const g = parseInt(match[2], 10)
    const b = parseInt(match[3], 10)

    const toHex = (n: number) => {
      return n.toString(16).padStart(2, "0")
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  } catch {
    return colorSwatches[0] // Fallback to default red
  }
}

function calculateFontSize(): number {
  return 12
}

function calculateScale(fontSize: string): number {
  if (fontSize === "auto" || fontSize === "12px") {
    return 1
  }

  try {
    const px = parseInt(fontSize, 10)
    if (isNaN(px)) {
      return 1
    }

    const scale = px / 12

    // Clamp between 0.5 and 2.0, round to 1 decimal
    const clamped = Math.max(0.5, Math.min(2.0, scale))
    return Math.round(clamped * 10) / 10
  } catch {
    return 1
  }
}

function mapShape(position: string): Shape {
  // Position 5 is frame, all others are ribbon
  return position === "5" ? "frame" : "ribbon"
}

function mapPosition(position: string): Position {
  const positionMap: Record<string, Position> = {
    "1": "right-top",
    "2": "left-top",
    "3": "right-bottom",
    "4": "left-bottom",
  }

  return positionMap[position] || "left-top" // Fallback to left-top
}

function createRuleFromAddress(address: string): Rule {
  const sanitized = address.replace(/^https?:\/\//, "")

  if (sanitized.startsWith("regex:")) {
    const pattern = sanitized.substring(6)
    return {
      type: "regexp",
      value: pattern,
      source: "fullUrl",
    }
  }

  return {
    type: "contains",
    value: sanitized,
    source: "fullUrl",
  }
}
