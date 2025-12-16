import { MessageKey } from "@/i18n"

export const URLS = {
  CONTACT_DEVELOPER:
    "https://chromewebstore.google.com/detail/weblabeler-environment-ma/cgkfepnmpmgdcchpkjedadmiebkpbogl/support",
  WRITE_REVIEW:
    "https://chromewebstore.google.com/detail/weblabeler-environment-ma/cgkfepnmpmgdcchpkjedadmiebkpbogl/reviews",
}

export const UPDATE_FREQUENCIES: ReadonlyArray<{
  value: string
  labelKey: MessageKey
}> = [
  { value: "0", labelKey: "updateFrequency_disabled" },
  { value: "15", labelKey: "updateFrequency_15min" },
  { value: "30", labelKey: "updateFrequency_30min" },
  { value: "60", labelKey: "updateFrequency_1hour" },
  { value: "360", labelKey: "updateFrequency_6hours" },
  { value: "1440", labelKey: "updateFrequency_24hours" },
]
