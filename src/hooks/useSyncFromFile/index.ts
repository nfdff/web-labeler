import { useConfigurationFileReader } from "../useConfigurationReader";
import { useImportLabels } from "../useImportLabels";
import { useOptionsContext } from "../../contexts";

export function useSyncFromFile() {
  const { options, dispatch } = useOptionsContext();
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
        title: "Import labels from file",
        messagePrefix: "From the file:",
      });
      return { success: true };
    }

    // Error is already in state (errorMessage), no need to dispatch to store
    return { success: false };
  };

  return { syncFromFile, isLoading, errorMessage };
}
