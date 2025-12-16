import { useConfigurationFileReader } from "@/hooks/useConfigurationReader";
import { useImportLabels } from "@/hooks/useImportLabels";
import { useOptionsContext } from "@/contexts";
import { useTranslation } from "@/contexts";

export function useSyncFromFile() {
  const { options, dispatch } = useOptionsContext();
  const { t } = useTranslation();
  const { readAndValidate, isLoading, errorMessage } =
    useConfigurationFileReader();
  const { confirmAndImport } = useImportLabels({
    labels: options.labels,
    dispatch,
    updateSyncSettings: false,
  });

  const syncFromFile = async (file: File) => {
    const result = await readAndValidate(file);

    if (result.success) {
      confirmAndImport(result.data, {
        title: t("importLabels_title_fromFile"),
        messagePrefix: t("importLabels_prefix_file"),
      });
      return { success: true };
    }

    // Error is already in state (errorMessage), no need to dispatch to store
    return { success: false };
  };

  return { syncFromFile, isLoading, errorMessage };
}
