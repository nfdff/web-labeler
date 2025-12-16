import { useState } from "react"
import { Button, Group, Select, Stack, Text } from "@mantine/core"
import { IconCheck, IconX } from "@tabler/icons-react"
import { Label } from "@/options/types"
import { useTranslation } from "@/contexts"

interface CombineLabelsModalProps {
  selectedLabels: Label[]
  onConfirm: (targetLabelId: string) => void
  onClose: () => void
}

function CombineLabelsModal({
  selectedLabels,
  onConfirm,
  onClose,
}: CombineLabelsModalProps) {
  const [targetLabelId, setTargetLabelId] = useState<string | null>(null)
  const { t } = useTranslation()

  const handleConfirm = () => {
    if (targetLabelId) {
      onConfirm(targetLabelId)
    }
  }

  return (
    <Stack gap="md">
      <Select
        placeholder={t("combineModal_selectTarget")}
        value={targetLabelId}
        onChange={setTargetLabelId}
        data={selectedLabels.map((label) => ({
          value: label.id,
          label: label.name,
        }))}
        allowDeselect={false}
        required
      />

      <Text size="sm">
        {t("combineModal_explanation")}
      </Text>
      <Text size="sm">{t("combineModal_confirmQuestion")}</Text>

      <Group gap="xs" justify="end">
        <Button
          size="xs"
          onClick={handleConfirm}
          leftSection={<IconCheck size={14} />}
          disabled={targetLabelId === null}
        >
          {t("common_confirm")}
        </Button>
        <Button
          size="xs"
          variant="light"
          onClick={onClose}
          leftSection={<IconX size={14} />}
        >
          {t("common_cancel")}
        </Button>
      </Group>
    </Stack>
  )
}

export default CombineLabelsModal
