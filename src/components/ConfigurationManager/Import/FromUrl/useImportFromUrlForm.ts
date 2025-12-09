import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { Dispatch } from "react";
import {
  getOriginPattern,
  requestUrlPermission,
} from "../../../../utils/urlPermissions.ts";
import { UrlSyncSettings, OptionsAction } from "../../../../options/types.ts";
import { modals } from "@mantine/modals";
import {
  createFormConfig,
  ImportFromUrlFormValues,
} from "./importFromUrlFormConfig.ts";
import { useSyncFromUrl } from "../../../../hooks/useSyncFromUrl";
import { transformCloudUrl } from "../../../../utils/cloudUrlTransformer.ts";

interface UseImportFromUrlFormParams {
  urlSync: UrlSyncSettings | undefined;
  dispatch: Dispatch<OptionsAction>;
  closeConfigurationManager?: () => void;
}

export function useImportFromUrlForm({
  urlSync,
  dispatch,
  closeConfigurationManager,
}: UseImportFromUrlFormParams) {
  const [permissionError, setPermissionError] = useState<string | undefined>();
  const { syncFromUrl, isLoading, errorMessage } = useSyncFromUrl();

  const form = useForm<ImportFromUrlFormValues>(
    createFormConfig(urlSync),
  );

  // Disable auto-sync when frequency is set to "Disabled"
  useEffect(() => {
    if (form.values.updateFrequency === "0") {
      form.setFieldValue("enabled", false);
    }
  }, [form, form.values.updateFrequency]);

  // Update form when urlSync settings change
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

  const getTransformedUrl = () => {
    const url = form.values.url.trim();
    return url ? transformCloudUrl(url) : "";
  };

  const getPermissionErrorMessage = (url: string, context: string) => {
    return `Permission denied to access ${getOriginPattern(url)}. ${context}`;
  };

  const handleSync = async () => {
    if (form.validate().hasErrors) {
      return;
    }

    const transformedUrl = getTransformedUrl();
    if (!transformedUrl) {
      return;
    }

    setPermissionError(undefined);
    const result = await syncFromUrl(transformedUrl);

    if (!result.success && result.error === "Permission denied") {
      setPermissionError(
        getPermissionErrorMessage(
          transformedUrl,
          "Please grant permission to fetch labels from this URL.",
        ),
      );
    }
  };

  const handleSaveSettings = async () => {
    if (form.validate().hasErrors) {
      return;
    }

    setPermissionError(undefined);
    const { updateFrequency, enabled } = form.values;
    const transformedUrl = getTransformedUrl();

    // Request permission if auto-sync is enabled and URL is set
    if (enabled && transformedUrl && parseInt(updateFrequency) > 0) {
      const hasPermission = await requestUrlPermission(transformedUrl);
      if (!hasPermission) {
        setPermissionError(
          getPermissionErrorMessage(
            transformedUrl,
            "Auto-sync requires permission to fetch from this URL.",
          ),
        );
        return;
      }
    }

    dispatch({
      type: "updateUrlSync",
      payload: {
        enabled,
        url: transformedUrl,
        updateFrequency: parseInt(updateFrequency),
      },
    });

    form.resetDirty();
    modals.closeAll();
    if (closeConfigurationManager) {
      closeConfigurationManager();
    }
  };

  return {
    form,
    permissionError,
    errorMessage,
    handleClear,
    handleSync,
    handleSaveSettings,
    isLoading,
  };
}
