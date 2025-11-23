import {
  Group,
  Switch,
  Text,
  HoverCard,
  Badge,
  Stack,
  ActionIcon,
  Tooltip,
  List,
} from "@mantine/core";
import {
  IconWorldUpload,
  IconAlertCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { AutoSyncStatusProps } from "./types";
import { getRelativeTime, formatUpdateFrequency } from "../../utils/timeFormat";
import { modals } from "@mantine/modals";
import ConfirmationModal from "../ConfirmationModal";
import { requestUrlPermission } from "../../utils/urlPermissions";
import { useConfigurationUrlReader } from "../../hooks/useConfigurationReader";

function AutoSyncStatus({ urlSync, dispatch, labels }: AutoSyncStatusProps) {
  const { readAndValidate, isLoading } = useConfigurationUrlReader();
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

  const handleManualSync = async () => {
    if (!urlSync.url || isLoading) {
      return;
    }

    // Request permission before fetching
    const hasPermission = await requestUrlPermission(urlSync.url);
    if (!hasPermission) {
      console.error("Permission denied for", urlSync.url);
      return;
    }

    // Use the hook to fetch and validate labels
    const labelsForImport = await readAndValidate(urlSync.url);

    if (labelsForImport) {
      const updatingLabelCount = labelsForImport.filter(
        (labelForImport) =>
          !!labels.find((label) => label.id === labelForImport.id),
      ).length;
      const newLabelsCount = labelsForImport.length - updatingLabelCount;

      modals.open({
        title: "Import labels from URL",
        size: "auto",
        children: (
          <ConfirmationModal
            message={
              <>
                From the URL:
                <List size="sm" mt={5} mb={5} withPadding>
                  <List.Item>
                    {newLabelsCount}
                    {" new " + (newLabelsCount === 1 ? " label " : "labels ")}
                    will be added;
                  </List.Item>
                  <List.Item>
                    {updatingLabelCount}
                    {" existing " +
                      (updatingLabelCount === 1 ? "label " : "labels ")}
                    will be updated.
                  </List.Item>
                </List>
              </>
            }
            onConfirm={() => {
              dispatch({
                type: "mergeLabels",
                payload: { labels: labelsForImport },
              });
              // Update last sync time and clear error
              dispatch({
                type: "updateUrlSync",
                payload: { lastUpdate: Date.now(), lastError: undefined },
              });
              modals.closeAll();
            }}
            onClose={() => modals.closeAll()}
          ></ConfirmationModal>
        ),
      });
    }
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
