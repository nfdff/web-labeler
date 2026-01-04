import { useCallback } from "react"
import { useOptionsContext } from "@/contexts"
import type { Label, Rule } from "@/options/types.ts"
import { getLabelById } from "@/utils/labelHelpers.ts"

export function useLabelOperations() {
  const { options, dispatch } = useOptionsContext()

  const addRuleToLabel = useCallback(
    (labelId: string, rule: Rule) => {
      const label = getLabelById(options.labels, labelId)
      if (!label) return

      const updatedLabel: Label = {
        ...label,
        rules: [...label.rules, rule],
      }

      dispatch({
        type: "updateLabel",
        payload: { label: updatedLabel },
      })
    },
    [options.labels, dispatch]
  )

  const updateRuleInLabel = useCallback(
    (labelId: string, oldRule: Rule, newRule: Rule) => {
      const label = getLabelById(options.labels, labelId)
      if (!label) return

      const updatedLabel: Label = {
        ...label,
        rules: label.rules.map((r) => (r === oldRule ? newRule : r)),
      }

      dispatch({
        type: "updateLabel",
        payload: { label: updatedLabel },
      })
    },
    [options.labels, dispatch]
  )

  const deleteRuleFromLabel = useCallback(
    (labelId: string, rule: Rule) => {
      const label = getLabelById(options.labels, labelId)
      if (!label) return

      const updatedLabel: Label = {
        ...label,
        rules: label.rules.filter((r) => r !== rule),
      }

      dispatch({
        type: "updateLabel",
        payload: { label: updatedLabel },
      })
    },
    [options.labels, dispatch]
  )

  const moveRuleBetweenLabels = useCallback(
    (
      fromLabelId: string,
      toLabelId: string,
      rule: Rule,
      updatedRule?: Rule
    ) => {
      const fromLabel = getLabelById(options.labels, fromLabelId)
      const toLabel = getLabelById(options.labels, toLabelId)
      if (!fromLabel || !toLabel) return

      const ruleToAdd = updatedRule || rule

      // Remove rule from source label
      const fromLabelUpdated: Label = {
        ...fromLabel,
        rules: fromLabel.rules.filter((r) => r !== rule),
      }

      // Add rule to target label
      const toLabelUpdated: Label = {
        ...toLabel,
        rules: [...toLabel.rules, ruleToAdd],
      }

      // Dispatch both updates
      dispatch({
        type: "updateLabel",
        payload: { label: fromLabelUpdated },
      })

      dispatch({
        type: "updateLabel",
        payload: { label: toLabelUpdated },
      })
    },
    [options.labels, dispatch]
  )

  const updateLabelProperty = useCallback(
    (labelId: string, updates: Partial<Label>) => {
      const label = getLabelById(options.labels, labelId)
      if (!label) return

      const updatedLabel: Label = {
        ...label,
        ...updates,
      }

      dispatch({
        type: "updateLabel",
        payload: { label: updatedLabel },
      })
    },
    [options.labels, dispatch]
  )

  return {
    addRuleToLabel,
    updateRuleInLabel,
    deleteRuleFromLabel,
    moveRuleBetweenLabels,
    updateLabelProperty,
  }
}
