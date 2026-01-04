import { useMemo, useState } from "react"
import { useOptionsContext } from "@/contexts"
import type { Label } from "@/options/types.ts"
import { getLabelById } from "@/utils/labelHelpers.ts"

export function useLabelSelector(initialLabelId: string = "") {
  const { options } = useOptionsContext()
  const [selectedLabelId, setSelectedLabelId] = useState<string>(initialLabelId)

  const selectedLabel = useMemo<Label | null>(
    () => getLabelById(options.labels, selectedLabelId),
    [options.labels, selectedLabelId]
  )

  return {
    selectedLabelId,
    setSelectedLabelId,
    selectedLabel,
    labels: options.labels,
  }
}
