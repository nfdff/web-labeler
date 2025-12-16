import { Label, OptionsAction, UrlSyncSettings } from "@/options/types";
import { Dispatch } from "react";

export interface ConfigurationManagerProps {
  labels: Label[];
  dispatch: Dispatch<OptionsAction>;
  urlSync?: UrlSyncSettings;
}
