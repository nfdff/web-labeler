import { LanguageConfig, SupportedLocale } from "./types.ts"

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: "en", name: "English", nativeName: "English", flag: "GB" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "RU" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "DE" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "ES" },
  { code: "fr", name: "French", nativeName: "Français", flag: "FR" },
  { code: "pt_BR", name: "Portuguese (Brazil)", nativeName: "Português", flag: "BR" },
  { code: "pt_PT", name: "Portuguese (Portugal)", nativeName: "Português", flag: "PT" },
]

export const DEFAULT_LOCALE: SupportedLocale = "en"
