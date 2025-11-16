import { Group, Switch, Text, HoverCard, Badge, Stack } from "@mantine/core";
import { IconWorldUpload, IconAlertCircle } from "@tabler/icons-react";
import { AutoSyncStatusProps } from "./types";
import { getRelativeTime, formatUpdateFrequency } from "../../utils/timeFormat";

function AutoSyncStatus({ urlSync, dispatch }: AutoSyncStatusProps) {
  // Hide widget if frequency is 0 (disabled) or not configured
  if (!urlSync || urlSync.updateFrequency === 0) {
    return null;
  }

  const handleToggle = (checked: boolean) => {
    dispatch({
      type: "updateUrlSync",
      payload: { enabled: checked },
    });

    // Service worker will react to storage changes automatically
  };

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
            <Text size="xs" c="dimmed" style={{ wordBreak: "break-all" }}>
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
    </Group>
  );
}

export default AutoSyncStatus;
