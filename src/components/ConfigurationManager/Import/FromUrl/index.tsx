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
  Tooltip,
} from "@mantine/core";
import {
  IconLock,
  IconRefresh,
  IconWorldUpload,
  IconBrandGoogleDrive,
  IconBrandOnedrive,
  IconCloud,
  IconAlertCircle,
} from "@tabler/icons-react";
import { UPDATE_FREQUENCIES } from "../../../../utils/constants.ts";
import { useImportFromUrlForm } from "./useImportFromUrlForm.ts";
import { useOptionsContext } from "../../../../contexts";
import { useCloudUrl } from "./useCloudUrl.ts";
import { CloudService } from "../../../../utils/cloudUrlTransformer.ts";

function getCloudIcon(service: CloudService) {
  switch (service) {
    case "google-drive":
      return <IconBrandGoogleDrive size={16} />;
    case "onedrive":
      return <IconBrandOnedrive size={16} />;
    case "dropbox":
      return <IconCloud size={16} />;
    default:
      return <IconWorldUpload size={16} />;
  }
}

function getTooltipText(
  service: CloudService,
  hasTransformation: boolean,
): string {
  if (!service) return "URL to JSON file";

  const serviceName =
    service === "google-drive"
      ? "Google Drive"
      : service === "onedrive"
        ? "OneDrive"
        : "Dropbox";

  if (hasTransformation) {
    return `${serviceName} URL detected. Will be transformed to direct download link.`;
  }
  return `${serviceName} direct download link detected.`;
}

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
            <div>{getCloudIcon(cloudService)}</div>
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

      {!!errorMessage && (
        <Alert
          color="red"
          title="Failed to sync"
          icon={<IconAlertCircle size={16} />}
        >
          {errorMessage}
        </Alert>
      )}
    </Stack>
  );
}

export default ConfigurationImportFromUrl;
