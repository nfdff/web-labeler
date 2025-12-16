import { Label } from "@/options/types";
import { Dispatch } from "react";
import { OptionsAction } from "@/options/types";

export interface UseImportLabelsParams {
  labels: Label[];
  dispatch: Dispatch<OptionsAction>;
  updateSyncSettings?: boolean; // Whether to update URL sync settings after import
}

export interface ImportLabelCounts {
  newLabelsCount: number;
  updatingLabelCount: number;
}

export interface ConfirmAndImportOptions {
  title?: string;
  messagePrefix?: string;
  onSuccess?: () => void;
}

export interface UseImportLabelsReturn {
  confirmAndImport: (
    labelsForImport: Label[],
    options?: ConfirmAndImportOptions
  ) => void;
  calculateCounts: (labelsForImport: Label[]) => ImportLabelCounts;
}
