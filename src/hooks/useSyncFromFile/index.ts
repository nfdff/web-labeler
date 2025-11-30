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
    const labelsForImport = await readAndValidate(file);

    if (labelsForImport) {
      confirmAndImport(labelsForImport, {
        title: "Import labels from file",
        messagePrefix: "From the file:",
      });
      return { success: true };
    }

    return { success: false };
  };

  return { syncFromFile, isLoading, errorMessage };
}
