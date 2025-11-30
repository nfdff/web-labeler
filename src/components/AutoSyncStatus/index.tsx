import {
  Group,
  Switch,
  Text,
  HoverCard,
  Badge,
  Stack,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconWorldUpload,
  IconAlertCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { getRelativeTime, formatUpdateFrequency } from "../../utils/timeFormat";
import { useAutoSyncStatus } from "./useAutoSyncStatus";

function AutoSyncStatus() {
  const { urlSync, handleToggle, handleManualSync, isLoading } =
    useAutoSyncStatus();

  // Hide widget if frequency is 0 (disabled) or not configured
  if (!urlSync || urlSync.updateFrequency === 0) {
    return null;
  }

  const hasError = !!urlSync.lastError;
  const formattedFrequency = formatUpdateFrequency(urlSync.updateFrequency);
  const lastSyncText = urlSync.lastUpdate
    ? getRelativeTime(urlSync.lastUpdate)
    : "Never";

  return (
    <Group gap="xs" wrap="nowrap">
      <HoverCard shadow="md" position="bottom-start" withArrow>
        <HoverCard.Target>
          <Text size="sm" c="dimmed" style={{ cursor: "help" }}>
            Auto-Sync
          </Text>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Stack gap="xs">
            <Group gap="xs">
              <IconWorldUpload size={16} />
              <Text size="sm" fw={500}>
                Sync URL
              </Text>
            </Group>
            <Text
              size="xs"
              c="dimmed"
              style={{
                wordBreak: "break-all",
                maxWidth: "350px",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {urlSync.url}
            </Text>
            <Text size="xs" c="dimmed" style={{ wordBreak: "break-all" }}>
              {formattedFrequency}
            </Text>
          </Stack>
        </HoverCard.Dropdown>
      </HoverCard>

      <Switch
        size="xs"
        checked={urlSync.enabled}
        onChange={(e) => handleToggle(e.currentTarget.checked)}
      />

      <Text size="sm" c="dimmed">
        Last:{" "}
      </Text>
      {hasError ? (
        <HoverCard shadow="md" position="bottom-start" withArrow>
          <HoverCard.Target>
            <Badge
              size="sm"
              color="red"
              variant="light"
              leftSection={<IconAlertCircle size={12} />}
              style={{ cursor: "help" }}
            >
              Error
            </Badge>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Stack gap="xs">
              <Group gap="xs">
                <IconAlertCircle size={16} color="red" />
                <Text size="sm" fw={500}>
                  Sync Error
                </Text>
              </Group>
              <Text size="xs" c="red">
                {urlSync.lastError}
              </Text>
            </Stack>
          </HoverCard.Dropdown>
        </HoverCard>
      ) : (
        <Text size="sm" c="dimmed">
          {lastSyncText}
        </Text>
      )}

      <Tooltip label="Sync now" position="bottom">
        <ActionIcon
          variant="subtle"
          size="sm"
          onClick={handleManualSync}
          loading={isLoading}
          disabled={isLoading}
          color="gray"
        >
          <IconRefresh size={14} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}

export default AutoSyncStatus;
