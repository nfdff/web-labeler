import { Alert } from "@mantine/core";
import { IconAlertCircle, IconLock } from "@tabler/icons-react";
import { ICON_SIZE } from "./constants.ts";
import { useTranslation } from "@/contexts";

interface SyncAlertsProps {
  permissionError?: string;
  errorMessage?: string;
}

export function SyncAlerts({ permissionError, errorMessage }: SyncAlertsProps) {
  const { t } = useTranslation();

  if (!permissionError && !errorMessage) return null;

  return (
    <>
      {permissionError && (
        <Alert
          color="orange"
          title={t("importFromUrl_permissionRequired")}
          icon={<IconLock size={ICON_SIZE} />}
        >
          {permissionError}
        </Alert>
      )}
      {errorMessage && (
        <Alert
          color="red"
          title={t("importFromUrl_syncFailed")}
          icon={<IconAlertCircle size={ICON_SIZE} />}
        >
          {errorMessage}
        </Alert>
      )}
    </>
  );
}
