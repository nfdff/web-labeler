import {
  Alert,
  Button,
  CloseButton,
  Group,
  List,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLock, IconRefresh, IconWorldUpload } from "@tabler/icons-react";
import { ConfigurationImportFromUrlProps } from "./types.ts";
import ErrorMessage from "../ErrorMessage";
import { useConfigurationUrlReader } from "../../../../hooks/useConfigurationReader";
import { modals } from "@mantine/modals";
import ConfirmationModal from "../../../ConfirmationModal";
import { useEffect, useState } from "react";
import { UPDATE_FREQUENCIES } from "../../../../utils/constants.ts";
import { isValidHttpUrl } from "../../../../utils/common.ts";
import {
  getOriginPattern,
  requestUrlPermission,
} from "../../../../utils/urlPermissions.ts";

//todo:
// 1. google drive support

function ConfigurationImportFromUrl({
  labels,
  dispatch,
  urlSync,
  closeConfigurationManager,
}: ConfigurationImportFromUrlProps) {
  const { readAndValidate, isLoading, errorMessage } =
    useConfigurationUrlReader();
  const [permissionError, setPermissionError] = useState<string | undefined>();

  const form = useForm({
    initialValues: {
      url: urlSync?.url || "",
      updateFrequency: String(urlSync?.updateFrequency || 0),
      enabled: urlSync?.enabled || false,
    },
    validate: {
      url: (value, values) => {
        if (values.updateFrequency !== "0" && !value.trim()) {
          return "URL is required when frequency is set";
        }
        if (!!value.trim() && !isValidHttpUrl(value)) {
          return "Invalid URL. Make sure it starts with http:// or https://.";
        }
        return null;
      },
    },
    enhanceGetInputProps: (payload) => ({
      disabled:
        payload.field === "enabled" &&
        payload.form.values.updateFrequency === "0",
    }),
  });

  useEffect(() => {
    if (form.values.updateFrequency === "0") {
      form.setFieldValue("enabled", false);
    }
  }, [form, form.values.updateFrequency]);

  // Update form when urlSync changes
  useEffect(() => {
    form.setValues({
      url: urlSync?.url || "",
      updateFrequency: String(urlSync?.updateFrequency || 0),
      enabled: urlSync?.enabled || false,
    });
    form.resetDirty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSync?.url, urlSync?.updateFrequency, urlSync?.enabled]);

  const handleClear = () => {
    form.setValues({ url: "", updateFrequency: "0", enabled: false });
    // Mark form as dirty to enable save button
    form.setFieldValue("url", "");
  };

  const handleSync = async () => {
    if (form.validate().hasErrors) {
      return;
    }

    setPermissionError(undefined);
    const url = form.values.url.trim();

    // Request permission before fetching
    const hasPermission = await requestUrlPermission(url);
    if (!hasPermission) {
      setPermissionError(
        `Permission denied to access ${getOriginPattern(url)}. Please grant permission to fetch labels from this URL.`,
      );
      return;
    }

    const labelsForImport = await readAndValidate(url);

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

  const handleSaveSettings = async () => {
    if (form.validate().hasErrors) {
      return;
    }

    setPermissionError(undefined);
    const { url, updateFrequency, enabled } = form.values;
    const trimmedUrl = url.trim();

    // Request permission if auto-sync is enabled and URL is set
    if (enabled && trimmedUrl && parseInt(updateFrequency) > 0) {
      const hasPermission = await requestUrlPermission(trimmedUrl);
      if (!hasPermission) {
        setPermissionError(
          `Permission denied to access ${getOriginPattern(trimmedUrl)}. Auto-sync requires permission to fetch from this URL.`,
        );
        return;
      }
    }

    dispatch({
      type: "updateUrlSync",
      payload: {
        enabled,
        url: trimmedUrl,
        updateFrequency: parseInt(updateFrequency),
      },
    });

    form.resetDirty();
    modals.closeAll();
    if (closeConfigurationManager) {
      closeConfigurationManager();
    }
  };

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

      {!!errorMessage && (
        <ErrorMessage
          title="Failed to fetch from URL:"
          message={errorMessage}
        />
      )}
    </Stack>
  );
}

export default ConfigurationImportFromUrl;
