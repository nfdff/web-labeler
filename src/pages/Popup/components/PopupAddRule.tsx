import { useState } from "react"
import {
  ActionIcon,
  Badge,
  Button,
  Combobox,
  Group,
  InputBase,
  Stack,
  Text,
  useCombobox,
} from "@mantine/core"
import { IconPlus, IconX } from "@tabler/icons-react"
import { useOptionsContext, useTranslation } from "@/contexts"
import { Label, Rule } from "@/options/types"
import RuleForm from "./RuleForm"

interface PopupAddRuleProps {
  currentUrl: string
}

function PopupAddRule({ currentUrl }: PopupAddRuleProps) {
  const { options, dispatch } = useOptionsContext()
  const { t } = useTranslation()

  const [showForm, setShowForm] = useState<boolean>(false)
  const [selectedLabelId, setSelectedLabelId] = useState<string>("")
  const combobox = useCombobox()

  if (options.labels.length === 0) {
    return (
      <Text size="xs" c="dimmed" ta="center">
        {t("popup_noLabels")}
      </Text>
    )
  }

  if (!showForm) {
    return (
      <Stack gap={8}>
        <Text size="xs" c="dimmed" ta="center">
          {t("popup_noMatchInfo")}
        </Text>
        <Button
          size="xs"
          fullWidth
          variant="light"
          leftSection={<IconPlus size={14} />}
          onClick={() => setShowForm(true)}
        >
          {t("popup_addToLabel")}
        </Button>
      </Stack>
    )
  }

  const handleSaveRule = (newRule: Rule) => {
    if (!selectedLabelId) {
      return
    }

    const label = options.labels.find((l) => l.id === selectedLabelId)
    if (!label) {
      return
    }

    const updatedLabel: Label = {
      ...label,
      rules: [...label.rules, newRule],
    }

    dispatch({
      type: "updateLabel",
      payload: { label: updatedLabel },
    })

    // Parent component will automatically re-render and show matched view
    // because options context changed, triggering useEffect that re-matches
  }

  return (
    <Stack gap={8}>
      <Group justify="space-between" align="center">
        <Text size="xs" fw={500} c="dimmed">
          {t("popup_addRuleTitle")}
        </Text>
        <ActionIcon
          size="xs"
          variant="subtle"
          onClick={() => setShowForm(false)}
          aria-label={t("common_cancel")}
        >
          <IconX size={14} />
        </ActionIcon>
      </Group>

      <Combobox
        store={combobox}
        onOptionSubmit={(value) => {
          setSelectedLabelId(value)
          combobox.closeDropdown()
        }}
        transitionProps={{ transition: "pop", duration: 200 }}
      >
        <Combobox.Target>
          <InputBase
            component="button"
            type="button"
            pointer
            size="xs"
            label={t("popup_selectLabel")}
            onClick={() => combobox.toggleDropdown()}
            rightSection={<Combobox.Chevron />}
          >
            {selectedLabelId ? (
              <Badge
                size="sm"
                p={8}
                style={{
                  backgroundColor:
                    options.labels.find((l) => l.id === selectedLabelId)
                      ?.bgColor || "#gray",
                  color:
                    options.labels.find((l) => l.id === selectedLabelId)
                      ?.textColor || "#000",
                }}
              >
                {options.labels.find((l) => l.id === selectedLabelId)?.name ||
                  t("common_noname")}
              </Badge>
            ) : (
              <Text size="xs" c="dimmed">
                {t("popup_selectLabel_placeholder")}
              </Text>
            )}
          </InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options style={{ maxHeight: 150, overflowY: "auto" }}>
            {options.labels.map((label) => (
              <Combobox.Option key={label.id} value={label.id}>
                <Badge
                  size="sm"
                  p={10}
                  style={{
                    backgroundColor: label.bgColor,
                    color: label.textColor,
                  }}
                >
                  {label.name || t("common_noname")}
                </Badge>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>

      <RuleForm currentUrl={currentUrl} onSave={handleSaveRule} />
    </Stack>
  )
}

export default PopupAddRule
