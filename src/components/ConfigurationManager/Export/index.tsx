import { Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { useSelectionContext, useOptionsContext } from "../../../contexts";

function ConfigurationExport() {
  const { selectedIds, hasSelection } = useSelectionContext();
  const { options } = useOptionsContext();

  const labelsToExport = hasSelection
    ? options.labels.filter((label) => selectedIds.has(label.id))
    : options.labels;

  const buttonText = hasSelection ? "Export Selected" : "Export Labels";

  const exportLabels = () => {
    const file = new File(
      [JSON.stringify(labelsToExport)],
      `Labels-${new Date().toISOString().split("T")[0]}.json`,
      {
        type: "text/json",
      },
    );

    const link = document.createElement("a");
    const url = URL.createObjectURL(file);

    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
