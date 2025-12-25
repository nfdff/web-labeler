import { Button, Group, Stack, Text } from "@mantine/core"
import { IconCheck, IconX } from "@tabler/icons-react"
import { useTranslation } from "@/contexts"
import { ConfirmationModalProps } from "./types.ts"

function ConfirmationModal({
  message,
  onConfirm,
  onClose,
  variant = "default",
}: ConfirmationModalProps) {
  const { t } = useTranslation()

  const isCompact = variant === "compact"

  return (
    <Stack>
      <Text size={isCompact ? "xs" : "sm"}>
        {message || t("confirmationModal_defaultMessage")}
      </Text>
      <Group gap="xs" justify="end">
        <Button
          size="xs"
          onClick={onConfirm}
          leftSection={<IconCheck size={isCompact ? 12 : 14} />}
        >
          {t("common_confirm")}
        </Button>
        <Button
          size="xs"
          variant="light"
          onClick={onClose}
          leftSection={<IconX size={isCompact ? 12 : 14} />}
        >
          {t("common_cancel")}
        </Button>
      </Group>
    </Stack>
  )
}

export default ConfirmationModal
