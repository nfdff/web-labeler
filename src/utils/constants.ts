import { MessageKey } from "@/i18n"

const BROWSER = import.meta.env.VITE_BROWSER || "chrome"

const CHROME_URLS = {
  CONTACT_DEVELOPER:
    "https://chromewebstore.google.com/detail/weblabeler-environment-ma/cgkfepnmpmgdcchpkjedadmiebkpbogl/support",
  WRITE_REVIEW:
    "https://chromewebstore.google.com/detail/weblabeler-environment-ma/cgkfepnmpmgdcchpkjedadmiebkpbogl/reviews",
}

// TODO: Update with actual Firefox Add-ons URLs when published
const FIREFOX_URLS = {
  CONTACT_DEVELOPER: null,
  WRITE_REVIEW: null,
}

export const URLS = BROWSER === "firefox" ? FIREFOX_URLS : CHROME_URLS
export const IS_FIREFOX = BROWSER === "firefox"

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
