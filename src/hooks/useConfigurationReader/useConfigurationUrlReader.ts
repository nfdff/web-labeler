import { useState } from "react";
import { Label } from "../../options/types.ts";
import { validateLabelsArray } from "../../utils/validateLabelsArray.ts";
import {
  FetchJsonFromUrlMessage,
  MessageResponse,
} from "../../background/types.ts";

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

      // Create type-safe message
      const message: FetchJsonFromUrlMessage = {
        type: "FETCH_JSON_FROM_URL",
        url,
      };

      // Fetch data from background script (without validation)
      chrome.runtime.sendMessage(
        message,
        (response: MessageResponse<"FETCH_JSON_FROM_URL">) => {
          setIsLoading(false);

          if (chrome.runtime.lastError) {
            const error =
              chrome.runtime.lastError.message ||
              "Communication error with background script";
            setErrorMessage(error);
            resolve(undefined);
            return;
          }

          if (!response.data) {
            setErrorMessage(response.error || "Failed to fetch data");
            resolve(undefined);
            return;
          }

          try {
            if (!Array.isArray(response.data)) {
              throw new Error("The URL doesn't return valid labels array");
            }

            validateLabelsArray(response.data);

            resolve(response.data as Label[]);
          } catch (err) {
            setErrorMessage(
              err instanceof Error ? err.message : "Validation error",
            );
            resolve(undefined);
          }
        },
      );
    });

  return {
    readAndValidate,
    isLoading,
    errorMessage,
  };
};
