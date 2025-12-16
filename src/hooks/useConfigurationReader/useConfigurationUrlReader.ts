import { useState } from "react";
import { validateLabelsArray } from "@/utils/validateLabelsArray.ts";
import {
  FetchJsonFromUrlMessage,
  MessageResponse,
} from "@/background/types.ts";
import { ReadAndValidateResult } from "./types.ts";

export type UseConfigurationUrlReader = () => {
  readAndValidate: (url: string) => Promise<ReadAndValidateResult>;
  isLoading: boolean;
  errorMessage: string | undefined;
};

export const useConfigurationUrlReader: UseConfigurationUrlReader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<undefined | string>(
    undefined,
  );

  const readAndValidate = (url: string) =>
    new Promise<ReadAndValidateResult>((resolve) => {
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
            resolve({ success: false, error });
            return;
          }

          if (!response.data) {
            const error = response.error || "Failed to fetch data";
            setErrorMessage(error);
            resolve({ success: false, error });
            return;
          }

          try {
            if (!Array.isArray(response.data)) {
              throw new Error("The URL doesn't return valid labels array");
            }

            validateLabelsArray(response.data);

            resolve({ success: true, data: response.data });
          } catch (err) {
            const error =
              err instanceof Error ? err.message : "Validation error";
            setErrorMessage(error);
            resolve({ success: false, error });
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
