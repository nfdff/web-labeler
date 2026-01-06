import { LanguageConfig, SupportedLocale } from "./types.ts"

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: "zh_CN", name: "Chinese", nativeName: "简体中文", flag: "CN" },
  { code: "en", name: "English", nativeName: "English", flag: "GB" },
  { code: "fr", name: "French", nativeName: "Français", flag: "FR" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "DE" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "IN" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "IT" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "JP" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "KR" },
  { code: "pt_BR", name: "Portuguese (Brazil)", nativeName: "Português", flag: "BR" },
  { code: "pt_PT", name: "Portuguese (Portugal)", nativeName: "Português", flag: "PT" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "RU" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "ES" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "UA" },
]

export const DEFAULT_LOCALE: SupportedLocale = "en"
