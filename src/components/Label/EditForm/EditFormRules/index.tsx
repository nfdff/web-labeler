import { ClipboardEvent } from "react"
import { Button, Flex, Select, Stack, TextInput } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { useTranslation } from "@/contexts"
import {
  ruleTypeSettings,
  ruleTypes,
  sourceTypeSettings,
  sourceTypes,
} from "@/options/constants.ts"
import { useLabelEditFormContext } from "../formContext.ts"
import { LabelEditFormValues } from "../types.ts"
import { getRuleValuePlaceholder } from "./utils.ts"

function LabelEditFormRules() {
  const form = useLabelEditFormContext()
  const { t } = useTranslation()

  const sourceTypeOptions = sourceTypes.map((source) => ({
    value: source,
    label: t(sourceTypeSettings[source].labelKey),
  }))

  const ruleTypeOptions = ruleTypes.map((type) => ({
    value: type,
    label: t(ruleTypeSettings[type].labelKey),
  }))

  const handlePaste = (
    event: ClipboardEvent<HTMLInputElement>,
    path: string,
    form: UseFormReturnType<LabelEditFormValues>
  ) => {
    const paste = event.clipboardData.getData("text")
    const withoutProtocol = paste.replace(/^https?:\/\//, "") // remove http/https

    // Detect if there's a meaningful path (not just "/" or empty)
    // Matches: "domain/path" or "/path" (but not "domain/" or "/")
    const hasPath = /^(\/\S+|[^/]*\/.+)/.test(withoutProtocol)

    if (hasPath) {
      // Keep full URL and auto-switch to fullUrl source
      const index = path.split(".")[1]
      form.setFieldValue(path, withoutProtocol)
      form.setFieldValue(`rules.${index}.source`, "fullUrl")
    } else {
      // Keep domain only, leave source unchanged
      const cleaned = withoutProtocol.replace(/\/.*$/, "")
      form.setFieldValue(path, cleaned)
    }

    event.preventDefault()
  }

  return (
    <Stack gap="xs">
      {form.getValues().rules.map((_item, index) => (
        <Flex key={`rule_${index}`} direction="row" gap="xs">
          <Select
            data={sourceTypeOptions}
            key={form.key(`rules.${index}.source`)}
            {...form.getInputProps(`rules.${index}.source`)}
            value={form.values.rules[index].source ?? sourceTypes[0]}
            style={{ maxWidth: "120px" }}
            allowDeselect={false}
          />
          <Select
            data={ruleTypeOptions}
            key={form.key(`rules.${index}.type`)}
            {...form.getInputProps(`rules.${index}.type`)}
            style={{ maxWidth: "160px" }}
            allowDeselect={false}
          />
          <TextInput
            placeholder={getRuleValuePlaceholder(
              form.values.rules[index]?.type,
              form.values.rules[index]?.source
            )}
            key={form.key(`rules.${index}.value`)}
            {...form.getInputProps(`rules.${index}.value`)}
            style={{ flexGrow: 1 }}
            onPaste={(event) =>
              handlePaste(event, `rules.${index}.value`, form)
            }
          />
          <Button
            color="gray"
            variant="light"
            p="xs"
            onClick={() => {
              form.removeListItem("rules", index)
            }}
          >
            <IconTrash size={14}></IconTrash>
          </Button>
        </Flex>
      ))}

      <Button
        size="xs"
        color="gray"
        variant="light"
        leftSection={<IconPlus size={14} />}
        onClick={() => {
          form.insertListItem("rules", {
            type: ruleTypes[0],
            value: "",
            source: sourceTypes[0],
          })
        }}
      >
        {t("rules_addRule")}
      </Button>
    </Stack>
  )
}

export default LabelEditFormRules
