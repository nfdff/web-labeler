import { Dispatch } from "react";
import { OptionsAction, UrlSyncSettings } from "../../options/types";

export interface AutoSyncStatusProps {
  urlSync?: UrlSyncSettings;
  dispatch: Dispatch<OptionsAction>;
}
