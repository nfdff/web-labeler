import { useState } from "react"
import { Button, Group, Select, Stack, Text } from "@mantine/core"
import { IconCheck, IconX } from "@tabler/icons-react"
import { Label } from "../../../options/types"

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

  const handleConfirm = () => {
    if (targetLabelId) {
      onConfirm(targetLabelId)
    }
  }

  return (
    <Stack gap="md">
      <Select
        placeholder="Select target label"
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
        All rules from the selected labels will be moved into the target label.
        The other selected labels will be deleted.
      </Text>
      <Text size="sm">Are you sure you want to continue?</Text>

      <Group gap="xs" justify="end">
        <Button
          size="xs"
          onClick={handleConfirm}
          leftSection={<IconCheck size={14} />}
          disabled={targetLabelId === null}
        >
          Confirm
        </Button>
        <Button
          size="xs"
          variant="light"
          onClick={onClose}
          leftSection={<IconX size={14} />}
        >
          Cancel
        </Button>
      </Group>
    </Stack>
  )
}

export default CombineLabelsModal
