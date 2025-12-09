import { Alert } from "@mantine/core";
import { IconAlertCircle, IconLock } from "@tabler/icons-react";
import { ICON_SIZE } from "./constants.ts";

interface SyncAlertsProps {
  permissionError?: string;
  errorMessage?: string;
}

export function SyncAlerts({ permissionError, errorMessage }: SyncAlertsProps) {
  if (!permissionError && !errorMessage) return null;

  return (
    <>
      {permissionError && (
        <Alert
          color="orange"
          title="Permission Required"
          icon={<IconLock size={ICON_SIZE} />}
        >
          {permissionError}
        </Alert>
      )}
      {errorMessage && (
        <Alert
          color="red"
          title="Failed to sync"
          icon={<IconAlertCircle size={ICON_SIZE} />}
        >
          {errorMessage}
        </Alert>
      )}
    </>
  );
}
