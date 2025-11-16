import { Dispatch } from "react";
import { OptionsAction } from "../../../../options/types.ts";
import { Label } from "../../../../options/types.ts";

export interface ConfigurationImportFromFilesProps {
  dispatch: Dispatch<OptionsAction>;
  labels: Label[];
  closeConfigurationManager?: () => void;
}
