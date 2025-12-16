import { Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { useSelectionContext, useOptionsContext } from "@/contexts";
import { downloadJsonFile } from "@/utils/downloadJsonFile";
import { useTranslation } from "@/contexts";

function ConfigurationExport() {
  const { selectedIds, hasSelection } = useSelectionContext();
  const { options } = useOptionsContext();
  const { t } = useTranslation();

  const labelsToExport = hasSelection
    ? options.labels.filter((label) => selectedIds.has(label.id))
    : options.labels;

  const buttonText = hasSelection ? t("export_selected") : t("export_all");

  const exportLabels = () => {
    const filename = `Labels-${new Date().toISOString().split("T")[0]}.json`;
    downloadJsonFile(labelsToExport, filename);
  };

  return (
    <Button
      disabled={!labelsToExport.length}
      onClick={exportLabels}
      variant="default"
      size="xs"
      leftSection={<IconDownload size={16} />}
      style={{ minWidth: "146px" }}
    >
      {buttonText}
    </Button>
  );
}

export default ConfigurationExport;
