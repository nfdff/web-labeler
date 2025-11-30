import { useOptionsContext } from "../../contexts";
import { useSyncFromUrl } from "../../hooks/useSyncFromUrl";

export function useAutoSyncStatus() {
  const { options, dispatch } = useOptionsContext();
  const { syncFromUrl, isLoading } = useSyncFromUrl();

  const urlSync = options.urlSync;

  const handleToggle = (checked: boolean) => {
    dispatch({
      type: "updateUrlSync",
      payload: { enabled: checked },
    });
  };

  const handleManualSync = async () => {
    if (!urlSync?.url) return;
    await syncFromUrl(urlSync.url);
  };

  return {
    urlSync,
    handleToggle,
    handleManualSync,
    isLoading,
  };
}
