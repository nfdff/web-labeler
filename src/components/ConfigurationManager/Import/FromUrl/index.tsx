import {
  Button,
  CloseButton,
  Group,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { UPDATE_FREQUENCIES } from "../../../../utils/constants.ts";
import { useImportFromUrlForm } from "./useImportFromUrlForm.ts";
import { useOptionsContext } from "../../../../contexts";
import { useCloudUrl } from "./useCloudUrl.ts";
import { getCloudIcon, getTooltipText } from "./cloudServiceHelpers.tsx";
import { SyncAlerts } from "./SyncAlerts.tsx";
import { ICON_SIZE } from "./constants.ts";

function ConfigurationImportFromUrl({
  closeConfigurationManager,
}: {
  closeConfigurationManager?: () => void;
}) {
  const { options, dispatch } = useOptionsContext();
  const urlSync = options.urlSync;

  const {
    form,
    permissionError,
    errorMessage,
    handleClear,
    handleSync,
    handleSaveSettings,
    isLoading,
  } = useImportFromUrlForm({
    urlSync,
    dispatch,
    closeConfigurationManager,
  });

  const { cloudService, hasTransformation } = useCloudUrl(form.values.url);

  return (
    <Stack gap="md">
      <TextInput
        label="URL"
        placeholder="https://example.com/labels.json"
        description="URL to a JSON file containing label configurations"
        {...form.getInputProps("url")}
        leftSection={
          <Tooltip label={getTooltipText(cloudService, hasTransformation)}>
            {getCloudIcon(cloudService)}
          </Tooltip>
        }
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={handleClear}
            style={{ display: form.values.url ? undefined : "none" }}
          />
        }
      />

      <Select
        label="Frequency"
        description="How often to automatically sync labels from the URL"
        data={UPDATE_FREQUENCIES}
        {...form.getInputProps("updateFrequency")}
        allowDeselect={false}
      />

      <Switch
        label="Enable auto-sync"
        description="Automatically update labels from URL at the specified frequency"
        labelPosition="left"
        {...form.getInputProps("enabled", { type: "checkbox" })}
      />

      {urlSync?.lastUpdate && (
        <Text size="xs" c="dimmed">
          Last synced: {new Date(urlSync.lastUpdate).toLocaleString()}
        </Text>
      )}

      <Group gap="xs">
        <Button
          variant="light"
          size="sm"
          leftSection={<IconRefresh size={ICON_SIZE} />}
          onClick={handleSync}
          disabled={!form.values.url.trim() || isLoading}
          loading={isLoading}
        >
          Sync Now
        </Button>

        <Button
          variant="filled"
          size="sm"
          onClick={handleSaveSettings}
          disabled={!form.isDirty()}
        >
          Save Settings
        </Button>
      </Group>

      <SyncAlerts
        permissionError={permissionError}
        errorMessage={errorMessage}
      />
    </Stack>
  );
}

export default ConfigurationImportFromUrl;
