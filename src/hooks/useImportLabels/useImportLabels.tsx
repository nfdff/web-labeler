import { modals } from "@mantine/modals";
import { List } from "@mantine/core";
import ConfirmationModal from "@/components/ConfirmationModal";
import {
  UseImportLabelsParams,
  UseImportLabelsReturn,
  ImportLabelCounts,
  ConfirmAndImportOptions,
} from "./types";
import { Label } from "@/options/types";
import { useTranslation } from "@/contexts";

export const useImportLabels = ({
  labels,
  dispatch,
  updateSyncSettings = false,
}: UseImportLabelsParams): UseImportLabelsReturn => {
  const { t } = useTranslation();

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
    const title = options?.title || t("importLabels_title_default");
    const messagePrefix = options?.messagePrefix || t("importLabels_prefix_default");

    const newLabelText = newLabelsCount === 1
      ? t("importLabels_label_singular")
      : t("importLabels_label_plural");
    const updatedLabelText = updatingLabelCount === 1
      ? t("importLabels_label_singular")
      : t("importLabels_label_plural");

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
                  {t("importLabels_message_new", [String(newLabelsCount), newLabelText])}
                </List.Item>
                <List.Item>
                  {t("importLabels_message_updated", [String(updatingLabelCount), updatedLabelText])}
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
