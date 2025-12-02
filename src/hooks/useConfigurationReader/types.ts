import { Label } from "../../options/types";

export type ReadAndValidateResult =
  | { success: true; data: Label[] }
  | { success: false; error: string };

export type UseConfigurationFileReader = () => {
  readAndValidate: (file: File) => Promise<Label[] | undefined>;
  isLoading: boolean;
  errorMessage: string | undefined;
};
