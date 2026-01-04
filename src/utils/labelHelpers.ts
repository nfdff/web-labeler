import type { Label } from "@/options/types"

export function getLabelById(labels: Label[], id: string): Label | null {
  return labels.find((label) => label.id === id) || null
}

export function getLabelsByIds(labels: Label[], ids: string[]): Label[] {
  return ids
    .map((id) => getLabelById(labels, id))
    .filter((label): label is Label => label !== null)
}

export function validateLabelExists(label: Label | null): label is Label {
  return label !== null
}
