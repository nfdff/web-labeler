import { Dispatch } from "react";
import { OptionsAction, UrlSyncSettings, Label } from "../../options/types";

export interface AutoSyncStatusProps {
  urlSync?: UrlSyncSettings;
  dispatch: Dispatch<OptionsAction>;
  labels: Label[];
}
