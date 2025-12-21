import { LanguageConfig, SupportedLocale } from "./types.ts"

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: "en", name: "English", nativeName: "English", flag: "GB" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "RU" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "DE" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "ES" },
  { code: "fr", name: "French", nativeName: "Français", flag: "FR" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "IT" },
  { code: "pt_BR", name: "Portuguese (Brazil)", nativeName: "Português (Brasil)", flag: "BR" },
  { code: "pt_PT", name: "Portuguese (Portugal)", nativeName: "Português (Portugal)", flag: "PT" },
]

export const DEFAULT_LOCALE: SupportedLocale = "en"
