import { requestUrlPermission } from "../../utils/urlPermissions";
import { useConfigurationUrlReader } from "../useConfigurationReader";
import { useImportLabels } from "../useImportLabels";
import { useOptionsContext } from "../../contexts";

export function useSyncFromUrl() {
  const { options, dispatch } = useOptionsContext();
  const { readAndValidate, isLoading, errorMessage } =
    useConfigurationUrlReader();
  const { confirmAndImport } = useImportLabels({
    labels: options.labels,
    dispatch,
    updateSyncSettings: true,
  });

  const syncFromUrl = async (url: string) => {
    if (!url || isLoading) {
      return { success: false, error: "Invalid URL or sync in progress" };
    }

    // Request permission before fetching
    const hasPermission = await requestUrlPermission(url);
    if (!hasPermission) {
      return { success: false, error: "Permission denied" };
    }

    // Fetch and validate labels
    const result = await readAndValidate(url);

    if (result.success) {
      confirmAndImport(result.data, {
        title: "Import labels from URL",
        messagePrefix: "From the URL:",
      });
      return { success: true };
    }

    // Set error in urlSync settings if fetch/validation failed
    dispatch({
      type: "updateUrlSync",
      payload: { lastError: result.error },
    });

    return { success: false, error: result.error };
  };

  return { syncFromUrl, isLoading, errorMessage };
}
