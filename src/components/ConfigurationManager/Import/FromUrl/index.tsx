import {
  Alert,
  Button,
  CloseButton,
  Group,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { IconLock, IconRefresh, IconWorldUpload } from "@tabler/icons-react";
import { UPDATE_FREQUENCIES } from "../../../../utils/constants.ts";
import { useImportFromUrlForm } from "./useImportFromUrlForm.ts";
import { useOptionsContext } from "../../../../contexts";

//todo:
// 1. google drive support

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
    handleClear,
    handleSync,
    handleSaveSettings,
    isLoading,
  } = useImportFromUrlForm({
    urlSync,
    dispatch,
    closeConfigurationManager,
  });

  return (
    <Stack gap="md">
      <TextInput
        label="URL"
        placeholder="https://example.com/labels.json"
        description="URL to a JSON file containing label configurations"
        {...form.getInputProps("url")}
        leftSection={<IconWorldUpload size={16} />}
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
          leftSection={<IconRefresh size={16} />}
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

      {!!permissionError && (
        <Alert
          color="orange"
          title="Permission Required"
          icon={<IconLock size={16} />}
        >
          {permissionError}
        </Alert>
      )}
    </Stack>
  );
}

export default ConfigurationImportFromUrl;
