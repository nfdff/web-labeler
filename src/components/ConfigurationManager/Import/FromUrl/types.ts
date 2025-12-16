import { Dispatch } from "react";
import { OptionsAction, UrlSyncSettings } from "@/options/types.ts";
import { Label } from "@/options/types.ts";

export interface ConfigurationImportFromUrlProps {
  dispatch: Dispatch<OptionsAction>;
  labels: Label[];
  urlSync?: UrlSyncSettings;
  closeConfigurationManager?: () => void;
}
