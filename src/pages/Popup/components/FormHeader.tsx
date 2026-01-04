import { ActionIcon, Group, Text } from "@mantine/core"
import { IconX } from "@tabler/icons-react"
import { useTranslation } from "@/contexts"

interface FormHeaderProps {
  title: string
  onClose: () => void
  closeAriaLabel?: string
}

function FormHeader({ title, onClose, closeAriaLabel }: FormHeaderProps) {
  const { t } = useTranslation()

  return (
    <Group justify="space-between" align="center">
      <Text size="xs" fw={500} c="dimmed">
        {title}
      </Text>
      <ActionIcon
        size="xs"
        variant="subtle"
        onClick={onClose}
        aria-label={closeAriaLabel || t("common_cancel")}
      >
        <IconX size={14} />
      </ActionIcon>
    </Group>
  )
}

export default FormHeader
