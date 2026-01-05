import { ClipboardEvent, useState } from "react"
import { Button, Group, Select, Stack, TextInput } from "@mantine/core"
import { IconCheck, IconPlus } from "@tabler/icons-react"
import { useTranslation } from "@/contexts"
import {
  RuleType,
  ruleTypeSettings,
  ruleTypes,
  sourceTypeSettings,
  sourceTypes,
} from "@/options/constants"
import { Rule } from "@/options/types"

interface RuleFormProps {
  currentUrl: string
  initialRule?: Rule
  onSave: (rule: Rule) => void
  onCancel?: () => void
}

function RuleForm({
  currentUrl,
  initialRule,
  onSave,
  onCancel,
}: RuleFormProps) {
  const { t } = useTranslation()

  // Extract hostname from URL for default value
  const defaultHostname = (() => {
    try {
      const urlWithProtocol = currentUrl.startsWith("http")
        ? currentUrl
        : `https://${currentUrl}`
      const url = new URL(urlWithProtocol)
      return url.hostname
    } catch {
      return ""
    }
  })()

  const [ruleSource, setRuleSource] = useState<"hostname" | "fullUrl">(
    initialRule?.source || "hostname"
  )
  const [ruleType, setRuleType] = useState<RuleType>(
    initialRule?.type || "matches"
  )
  const [ruleValue, setRuleValue] = useState<string>(
    initialRule?.value || defaultHostname
  )

  // Source select options
  const sourceOptions = sourceTypes.map((source) => ({
    value: source,
    label: t(sourceTypeSettings[source].labelKey),
  }))

  // Type select options
  const typeOptions = ruleTypes.map((type) => ({
    value: type,
    label: t(ruleTypeSettings[type].labelKey),
  }))

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const paste = event.clipboardData.getData("text")
    const withoutProtocol = paste.replace(/^https?:\/\//, "") // remove http/https

    // Detect if there's a meaningful path (not just "/" or empty)
    // Matches: "domain/path" or "/path" (but not "domain/" or "/")
    const hasPath = /^(\/\S+|[^/]*\/.+)/.test(withoutProtocol)

    if (hasPath) {
      // Keep full URL and auto-switch to fullUrl source
      setRuleValue(withoutProtocol)
      setRuleSource("fullUrl")
    } else {
      // Keep domain only, leave source unchanged
      const cleaned = withoutProtocol.replace(/\/.*$/, "")
      setRuleValue(cleaned)
    }

    event.preventDefault()
  }

  const handleSave = () => {
    if (!ruleValue.trim()) {
      return
    }

    const rule: Rule = {
      type: ruleType,
      value: ruleValue.trim(),
      source: ruleSource,
    }

    onSave(rule)
  }

  const isEditing = !!initialRule

  return (
    <Stack gap={8}>
      <Group gap={6} grow>
        <Select
          size="xs"
          data={sourceOptions}
          value={ruleSource}
          onChange={(value) =>
            setRuleSource((value as "hostname" | "fullUrl") || "hostname")
          }
          allowDeselect={false}
        />
        <Select
          size="xs"
          data={typeOptions}
          value={ruleType}
          onChange={(value) => setRuleType((value as RuleType) || "matches")}
          allowDeselect={false}
        />
      </Group>

      <TextInput
        size="xs"
        value={ruleValue}
        onChange={(e) => setRuleValue(e.currentTarget.value)}
        onPaste={handlePaste}
        placeholder={defaultHostname}
      />

      <Group gap={6} justify="end">
        {onCancel && (
          <Button size="xs" variant="light" onClick={onCancel}>
            {t("common_cancel")}
          </Button>
        )}
        <Button
          size="xs"
          leftSection={
            isEditing ? <IconCheck size={14} /> : <IconPlus size={14} />
          }
          onClick={handleSave}
          disabled={!ruleValue.trim()}
        >
          {isEditing ? t("common_save") : t("popup_addRule")}
        </Button>
      </Group>
    </Stack>
  )
}

export default RuleForm
