import { useState } from "react";
import { readJsonFromUrl } from "../../utils/fileReader";
import { validationSchema } from "../../options/validationSchema.ts";
import validate from "../../utils/schemaValidator";
import { Label } from "../../options/types.ts";

export type UseConfigurationUrlReader = () => {
  readAndValidate: (url: string) => Promise<Label[] | undefined>;
  isLoading: boolean;
  errorMessage: string | undefined;
};

export const useConfigurationUrlReader: UseConfigurationUrlReader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<undefined | string>(
    undefined,
  );

  const readAndValidate = (url: string) =>
    new Promise<undefined | Label[]>((resolve) => {
      setIsLoading(true);
      setErrorMessage(undefined);

      readJsonFromUrl(url)
        .then((result) => {
          try {
            if (Array.isArray(result)) {
              for (const item of result) {
                const { result: isValid, messages } = validate(
                  item,
                  validationSchema,
                );
                if (!isValid) {
                  throw new Error(messages?.join("; "));
                }
              }
            } else {
              throw new Error("The URL doesn't return valid labels");
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
