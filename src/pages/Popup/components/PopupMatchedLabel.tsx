import { useState } from "react"
import {
  ActionIcon,
  Badge,
  Combobox,
  Group,
  InputBase,
  Stack,
  Switch,
  Text,
  Tooltip,
  useCombobox,
} from "@mantine/core"
import { modals } from "@mantine/modals"
import { IconEdit, IconReplace, IconTrash, IconX } from "@tabler/icons-react"
import ConfirmationModal from "@/components/ConfirmationModal"
import { useOptionsContext, useTranslation } from "@/contexts"
import {
  positions,
  ruleTypeSettings,
  sourceTypeSettings,
} from "@/options/constants"
import { Label, Rule } from "@/options/types"
import RuleForm from "./RuleForm"

interface PopupMatchedLabelProps {
  label: Label
  matchedRule: Rule
  currentUrl: string
}

function PopupMatchedLabel({
  label,
  matchedRule,
  currentUrl,
}: PopupMatchedLabelProps) {
  const { options, dispatch } = useOptionsContext()
  const { t } = useTranslation()

  const [isEditing, setIsEditing] = useState(false)
  const [selectedLabelId, setSelectedLabelId] = useState(label.id)
  const combobox = useCombobox()

  const handleToggleActive = () => {
    dispatch({
      type: "toggleLabelStatus",
      payload: { id: label.id },
    })
  }

  const handleCyclePosition = () => {
    const currentIndex = positions.indexOf(label.position)
    const nextIndex = (currentIndex + 1) % positions.length
    const nextPosition = positions[nextIndex]

    const updatedLabel: Label = {
      ...label,
      position: nextPosition,
    }

    dispatch({
      type: "updateLabel",
      payload: { label: updatedLabel },
    })
  }

  const handleSaveEdit = (updatedRule: Rule) => {
    // Find the target label (may be different from current if user changed it)
    const targetLabel = options.labels.find((l) => l.id === selectedLabelId)
    if (!targetLabel) return

    // If changing to a different label
    if (selectedLabelId !== label.id) {
      // Remove rule from current label
      const currentLabelUpdated: Label = {
        ...label,
        rules: label.rules.filter((r) => r !== matchedRule),
      }
      dispatch({
        type: "updateLabel",
        payload: { label: currentLabelUpdated },
      })

      // Add rule to target label
      const targetLabelUpdated: Label = {
        ...targetLabel,
        rules: [...targetLabel.rules, updatedRule],
      }
      dispatch({
        type: "updateLabel",
        payload: { label: targetLabelUpdated },
      })
    } else {
      // Update rule in same label
      const updatedLabel: Label = {
        ...label,
        rules: label.rules.map((r) => (r === matchedRule ? updatedRule : r)),
      }
      dispatch({
        type: "updateLabel",
        payload: { label: updatedLabel },
      })
    }

    setIsEditing(false)
  }

  const handleDeleteRule = () => {
    modals.open({
      title: t("popup_deleteRuleTitle"),
      size: "sm",
      centered: true,
      styles: { title: { fontSize: 14 } },
      transitionProps: { transition: "pop-bottom-right" },
      children: (
        <ConfirmationModal
          variant="compact"
          message={t("popup_deleteRuleConfirm")}
          onConfirm={() => {
            const updatedLabel: Label = {
              ...label,
              rules: label.rules.filter((r) => r !== matchedRule),
            }
            dispatch({
              type: "updateLabel",
              payload: { label: updatedLabel },
            })
            modals.closeAll()
          }}
          onClose={() => modals.closeAll()}
        />
      ),
    })
  }

  const showPositionSwitcher = label.shape !== "frame"

  // Format rule info for display
  const ruleSourceLabel = t(
    sourceTypeSettings[matchedRule.source || "hostname"].labelKey
  )
  const ruleTypeLabel = t(ruleTypeSettings[matchedRule.type].labelKey)
  const ruleInfo = `${ruleSourceLabel} ${ruleTypeLabel} "${matchedRule.value}"`

  // Show edit form
  if (isEditing) {
    return (
      <Stack gap={8}>
        <Group justify="space-between" align="center">
          <Text size="xs" fw={500} c="dimmed">
            {t("popup_editRuleTitle")}
          </Text>
          <ActionIcon
            size="xs"
            variant="subtle"
            onClick={() => setIsEditing(false)}
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
                      options.labels.find((l) => l.id === selectedLabelId)?.bgColor ||
                      "#gray",
                    color:
                      options.labels.find((l) => l.id === selectedLabelId)?.textColor ||
                      "#000",
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
              {options.labels.map((l) => (
                <Combobox.Option key={l.id} value={l.id}>
                  <Badge
                    size="sm"
                    p={10}
                    style={{
                      backgroundColor: l.bgColor,
                      color: l.textColor,
                    }}
                  >
                    {l.name || t("common_noname")}
                  </Badge>
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>

        <RuleForm
          currentUrl={currentUrl}
          initialRule={matchedRule}
          onSave={handleSaveEdit}
        />
      </Stack>
    )
  }

  // Show matched label view
  return (
    <Stack gap={8}>
      <Text size="xs" fw={500} c="dimmed">
        {t("popup_matchedLabel")}
      </Text>

      <Group wrap="nowrap" gap={6} justify="space-between">
        <Badge
          size="sm"
          p={8}
          style={{
            backgroundColor: label.bgColor,
            color: label.textColor,
          }}
        >
          {label.name || t("common_noname")}
        </Badge>

        <Group gap={6} wrap="nowrap">
          {showPositionSwitcher && (
            <Tooltip label={t("popup_cyclePosition")} withArrow>
              <ActionIcon
                variant="default"
                size="sm"
                radius="md"
                onClick={handleCyclePosition}
                aria-label={t("popup_cyclePosition")}
              >
                <IconReplace size={14} />
              </ActionIcon>
            </Tooltip>
          )}

          <Switch
            size="xs"
            disabled={!options.isActive}
            checked={label.isActive}
            onChange={handleToggleActive}
          />
        </Group>
      </Group>

      <Group wrap="nowrap" gap={6} justify="space-between" align="center">
        <Text size="xs" c="dimmed" style={{ flex: 1 }}>
          {ruleInfo}
        </Text>
        <Group gap={4} wrap="nowrap">
          <Tooltip label={t("popup_editRule")} withArrow>
            <ActionIcon
              variant="light"
              color="blue"
              size="sm"
              radius="md"
              onClick={() => setIsEditing(true)}
              aria-label={t("popup_editRule")}
            >
              <IconEdit size={14} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t("popup_deleteRule")} withArrow>
            <ActionIcon
              variant="light"
              color="red"
              size="sm"
              radius="md"
              onClick={handleDeleteRule}
              aria-label={t("popup_deleteRule")}
            >
              <IconTrash size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Stack>
  )
}

export default PopupMatchedLabel
