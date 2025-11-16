import {
  TextInput,
  Select,
  Button,
  Stack,
  Group,
  Switch,
  Text,
  List,
  CloseButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconRefresh, IconWorldUpload } from "@tabler/icons-react";
import { ConfigurationImportFromUrlProps } from "./types.ts";
import ErrorMessage from "../ErrorMessage";
import { useConfigurationUrlReader } from "../../../../hooks/useConfigurationReader";
import { modals } from "@mantine/modals";
import ConfirmationModal from "../../../ConfirmationModal";
import { useEffect } from "react";
import { UPDATE_FREQUENCIES } from "../../../../utils/constants.ts";
import { isValidHttpUrl } from "../../../../utils/common.ts";

//todo:
// 1. google drive support
// 2. reuse fetch file method from the background script
// 3. check on start if alarm was missed (diff between last import and current datetime comparing with sync frequency)
// 4. sync now icon button in AutoSyncStatus component

function ConfigurationImportFromUrl({
  labels,
  dispatch,
  urlSync,
  closeConfigurationManager,
}: ConfigurationImportFromUrlProps) {
  const { readAndValidate, isLoading, errorMessage } =
    useConfigurationUrlReader();

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
  }, [urlSync]);

  const handleClear = () => {
    form.setValues({ url: "", updateFrequency: "0", enabled: false });
    // Mark form as dirty to enable save button
    form.setFieldValue("url", "");
  };

  const handleSync = async () => {
    if (form.validate().hasErrors) {
      return;
    }

    const labelsForImport = await readAndValidate(form.values.url.trim());

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

  const handleSaveSettings = () => {
    if (!form.validate().hasErrors) {
      const { url, updateFrequency, enabled } = form.values;

      dispatch({
        type: "updateUrlSync",
        payload: {
          enabled,
          url: url.trim(),
          updateFrequency: parseInt(updateFrequency),
        },
      });

      form.resetDirty();
      modals.closeAll();
      if (closeConfigurationManager) {
        closeConfigurationManager();
      }
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
