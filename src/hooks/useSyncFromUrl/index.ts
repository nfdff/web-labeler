import { requestUrlPermission } from "@/utils/urlPermissions";
import { useConfigurationUrlReader } from "@/hooks/useConfigurationReader";
import { useImportLabels } from "@/hooks/useImportLabels";
import { useOptionsContext } from "@/contexts";
import { useTranslation } from "@/contexts";

export function useSyncFromUrl() {
  const { options, dispatch } = useOptionsContext();
  const { t } = useTranslation();
  const { readAndValidate, isLoading, errorMessage } =
    useConfigurationUrlReader();
  const { confirmAndImport } = useImportLabels({
    labels: options.labels,
    dispatch,
    updateSyncSettings: true,
  });

  const syncFromUrl = async (url: string) => {
    if (!url || isLoading) {
      return { success: false, error: t("validation_invalidUrl") };
    }

    // Request permission before fetching
    const hasPermission = await requestUrlPermission(url);
    if (!hasPermission) {
      return { success: false, error: t("validation_permissionDenied") };
    }

    // Fetch and validate labels
    const result = await readAndValidate(url);

    if (result.success) {
      confirmAndImport(result.data, {
        title: t("importLabels_title_fromUrl"),
        messagePrefix: t("importLabels_prefix_url"),
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
