import { useState } from "react";
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

      chrome.runtime.sendMessage(
        { type: "FETCH_LABELS_FROM_URL", url },
        (response: { labels: Label[] | null; error?: string }) => {
          setIsLoading(false);

          if (chrome.runtime.lastError) {
            const error =
              chrome.runtime.lastError.message ||
              "Communication error with background script";
            setErrorMessage(error);
            resolve(undefined);
            return;
          }

          if (response.labels) {
            resolve(response.labels);
          } else {
            setErrorMessage(response.error || "Unknown error");
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
