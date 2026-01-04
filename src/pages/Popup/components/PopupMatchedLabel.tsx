import { useState } from "react"
import { ActionIcon, Group, Stack, Switch, Text, Tooltip } from "@mantine/core"
import { modals } from "@mantine/modals"
import { IconEdit, IconReplace, IconTrash } from "@tabler/icons-react"
import ConfirmationModal from "@/components/ConfirmationModal"
import { LabelBadge } from "@/components/Label"
import { LabelSelector } from "@/components/Label"
import { useOptionsContext, useTranslation } from "@/contexts"
import { useLabelOperations } from "@/hooks/useLabelOperations"
import { positions } from "@/options/constants"
import { Label, Rule } from "@/options/types"
import { formatRuleInfo } from "@/utils/ruleFormatters"
import FormHeader from "./FormHeader"
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
  const { updateRuleInLabel, moveRuleBetweenLabels, deleteRuleFromLabel } =
    useLabelOperations()

  const [isEditing, setIsEditing] = useState(false)
  const [selectedLabelId, setSelectedLabelId] = useState(label.id)

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
    // If changing to a different label
    if (selectedLabelId !== label.id) {
      moveRuleBetweenLabels(label.id, selectedLabelId, matchedRule, updatedRule)
    } else {
      // Update rule in same label
      updateRuleInLabel(label.id, matchedRule, updatedRule)
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
            deleteRuleFromLabel(label.id, matchedRule)
            modals.closeAll()
          }}
          onClose={() => modals.closeAll()}
        />
      ),
    })
  }

  const showPositionSwitcher = label.shape !== "frame"

  // Format rule info for display
  const ruleInfo = formatRuleInfo(matchedRule, t)

  // Show edit form
  if (isEditing) {
    return (
      <Stack gap={8}>
        <FormHeader
          title={t("popup_editRuleTitle")}
          onClose={() => setIsEditing(false)}
        />

        <LabelSelector
          selectedLabelId={selectedLabelId}
          onSelect={setSelectedLabelId}
        />

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
        <LabelBadge label={label} size="sm" p={8} />

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
