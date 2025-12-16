import { Button, Group, Stack, Text } from "@mantine/core";
import { ConfirmationModalProps } from "./types.ts";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useTranslation } from "@/contexts";

function ConfirmationModal({
  message,
  onConfirm,
  onClose,
}: ConfirmationModalProps) {
  const { t } = useTranslation();
  return (
    <Stack>
      <Text size="sm">{message || t("confirmationModal_defaultMessage")}</Text>
      <Group gap="xs" justify="end">
        <Button
          size="xs"
          onClick={onConfirm}
          leftSection={<IconCheck size={14} />}
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
  );
}

export default ConfirmationModal;
