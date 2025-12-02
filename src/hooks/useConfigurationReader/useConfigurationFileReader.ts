import { useState } from "react";
import { readJsonFile } from "../../utils/fileReader";
import { validateLabelsArray } from "../../utils/validateLabelsArray.ts";
import { ReadAndValidateResult } from "./types.ts";

export type UseConfigurationFileReader = () => {
  readAndValidate: (file: File) => Promise<ReadAndValidateResult>;
  isLoading: boolean;
  errorMessage: string | undefined;
};

export const useConfigurationFileReader: UseConfigurationFileReader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<undefined | string>(
    undefined,
  );

  const readAndValidate = (file: File) =>
    new Promise<ReadAndValidateResult>((resolve) => {
      setIsLoading(true);
      setErrorMessage(undefined);

      readJsonFile(file)
        .then((result) => {
          try {
            if (Array.isArray(result)) {
              validateLabelsArray(result);
            } else {
              throw new Error("The file doesn't contain valid labels");
            }
            setIsLoading(false);
            resolve({ success: true, data: result });
          } catch (err) {
            const error = err instanceof Error ? err.message : "unknown error";
            setErrorMessage(error);
            setIsLoading(false);
            resolve({ success: false, error });
          }
        })
        .catch((err) => {
          const error = err instanceof Error ? err.message : "unknown error";
          setErrorMessage(error);
          setIsLoading(false);
          resolve({ success: false, error });
        });
    });

  return {
    readAndValidate,
    isLoading,
    errorMessage,
  };
};
