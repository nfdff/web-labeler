import { useState } from "react";
import { readJsonFile } from "../../utils/fileReader";
import { validateLabelsArray } from "../../utils/validateLabelsArray.ts";
import { Label } from "../../options/types.ts";

export type UseConfigurationFileReader = () => {
  readAndValidate: (file: File) => Promise<Label[] | undefined>;
  isLoading: boolean;
  errorMessage: string | undefined;
};

export const useConfigurationFileReader: UseConfigurationFileReader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<undefined | string>(
    undefined,
  );

  const readAndValidate = (file: File) =>
    new Promise<undefined | Label[]>((resolve) => {
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
            resolve(result as Label[]);
          } catch (err) {
            setErrorMessage(
              err instanceof Error ? err.message : "unknown error",
            );
            setIsLoading(false);
          }
          resolve(undefined);
        })
        .catch((err) => {
          setErrorMessage(err instanceof Error ? err.message : "unknown error");
          setIsLoading(false);
          resolve(undefined);
        });
    });

  return {
    readAndValidate,
    isLoading,
    errorMessage,
  };
};
