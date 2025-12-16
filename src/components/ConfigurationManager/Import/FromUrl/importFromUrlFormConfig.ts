import { UrlSyncSettings } from "@/options/types.ts";
import { isValidHttpUrl } from "@/utils/common.ts";
import { UseFormReturnType } from "@mantine/form";

export interface ImportFromUrlFormValues {
  url: string;
  updateFrequency: string;
  enabled: boolean;
}

export function createFormConfig(urlSync: UrlSyncSettings | undefined) {
  return {
    initialValues: {
      url: urlSync?.url || "",
      updateFrequency: String(urlSync?.updateFrequency || 0),
      enabled: urlSync?.enabled || false,
    },
    validate: {
      url: (value: string, values: ImportFromUrlFormValues) => {
        if (values.updateFrequency !== "0" && !value.trim()) {
          return "URL is required when frequency is set";
        }
        if (!!value.trim() && !isValidHttpUrl(value)) {
          return "Invalid URL. Make sure it starts with http:// or https://.";
        }
        return null;
      },
    },
    enhanceGetInputProps: (payload: {
      field: string;
      form: UseFormReturnType<ImportFromUrlFormValues>;
    }) => ({
      disabled:
        payload?.field === "enabled" &&
        payload?.form.values.updateFrequency === "0",
    }),
  };
}
