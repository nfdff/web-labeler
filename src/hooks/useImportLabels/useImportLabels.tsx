import { modals } from "@mantine/modals";
import { List } from "@mantine/core";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
  UseImportLabelsParams,
  UseImportLabelsReturn,
  ImportLabelCounts,
  ConfirmAndImportOptions,
} from "./types";
import { Label } from "../../options/types";

export const useImportLabels = ({
  labels,
  dispatch,
  updateSyncSettings = false,
}: UseImportLabelsParams): UseImportLabelsReturn => {
  const calculateCounts = (labelsForImport: Label[]): ImportLabelCounts => {
    const updatingLabelCount = labelsForImport.filter((labelForImport) =>
      labels.some((label) => label.id === labelForImport.id)
    ).length;

    const newLabelsCount = labelsForImport.length - updatingLabelCount;

    return { newLabelsCount, updatingLabelCount };
  };

  const confirmAndImport = (
    labelsForImport: Label[],
    options?: ConfirmAndImportOptions
  ) => {
    const { newLabelsCount, updatingLabelCount } =
      calculateCounts(labelsForImport);
    const title = options?.title || "Import labels";
    const messagePrefix = options?.messagePrefix || "From the imported source:";

    modals.open({
      title,
      size: "auto",
      children: (
        <ConfirmationModal
          message={
            <>
              {messagePrefix}
              <List size="sm" mt={5} mb={5} withPadding>
                <List.Item>
                  {newLabelsCount}
                  {" new " + (newLabelsCount === 1 ? "label" : "labels")}
                  {" will be added;"}
                </List.Item>
                <List.Item>
                  {updatingLabelCount}
                  {" existing " +
                    (updatingLabelCount === 1 ? "label" : "labels")}
                  {" will be updated."}
                </List.Item>
              </List>
            </>
          }
          onConfirm={() => {
            dispatch({
              type: "mergeLabels",
              payload: { labels: labelsForImport },
            });

            if (updateSyncSettings) {
              dispatch({
                type: "updateUrlSync",
                payload: { lastUpdate: Date.now(), lastError: undefined },
              });
            }

            modals.closeAll();
            options?.onSuccess?.();
          }}
          onClose={() => modals.closeAll()}
        />
      ),
    });
  };

  return {
    confirmAndImport,
    calculateCounts,
  };
};
