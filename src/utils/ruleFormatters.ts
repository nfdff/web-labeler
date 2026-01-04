import type { TranslationFunction } from "@/i18n/types"
import { ruleTypeSettings, sourceTypeSettings } from "@/options/constants"
import type { Rule } from "@/options/types"

export function formatRuleInfo(rule: Rule, t: TranslationFunction): string {
  const ruleSourceLabel = t(
    sourceTypeSettings[rule.source || "hostname"].labelKey
  )
  const ruleTypeLabel = t(ruleTypeSettings[rule.type].labelKey)
  return `${ruleSourceLabel} ${ruleTypeLabel} "${rule.value}"`
}
